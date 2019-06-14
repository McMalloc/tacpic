import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Manipulator from "./Manipulator";

import {debounce} from "lodash";

import Rect from "./Rect";
import {OBJECT} from "../../constants";
import Label from "./Label";
import uuidv4 from "../../../../utility/uuid";
import ContextOptions from "./ContextOptions";
import {find} from "lodash";

class InteractiveSVG extends Component {
    svgElement = React.createRef();
    state = {
        mouseXDrag: 0,
        mouseYDrag: 0,
        showContext: false
    };

    mouseXDown = null; // in den state packen
    mouseYDown = null;
    dragging = false;
    mouseIsDown = false;
    lastUuid = null;

    currentX = eventX => {
        return eventX - this.svgElement.current.getBoundingClientRect().left;
    };
    currentY = eventY => {
        return eventY - this.svgElement.current.getBoundingClientRect().top;
    };

    onInputHandler = event => {
        event.target.tagName === "TEXTAREA" && // oh look, it is an editable label!
            this.props.changeProp(this.props.selectedObjects[0], 'text', event.target.value);
    };

    mouseDownHandler = event => {
        this.mouseXDown = this.currentX(event.clientX); // todo zum State machen
        this.mouseYDown = this.currentY(event.clientY);
        this.mouseIsDown = true;

        this.setState({showContext: false});

        let id = event.target.id;
        switch (id) {
            case '_SVG': // this.svgElement.current.id
                this.props.unselect();
                this.props.clampStart();
                break;
            case 'manipulator':
                // hier kommt der code für die verschiedenen Manipulatorgriffe rein
                break;
            default:
                if (id.includes("editable")) { // editable pane of label was clicked
                    this.props.select(id.slice(9));
                } else if (id.includes("braille")) { // braille of label was clicked
                    this.props.select(id.slice(8));
                } else {
                    this.props.select(id);
                }

                this.props.transformStart("translate");
                // ein tatsächliches Objekt wurde geklickt
                break;
        }

    };

    keyDownHandler = event => {
        // const selectedObject = find(this.props.openedFile.pages[this.props.currentPage].objects, {uuid: this.props.selectedObjects[0]});

        switch(event.which) {// TODO use constants instead of magic numbers
            case 38: // up
                this.props.transformStart("translate");
                this.props.transform.translate({
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: -2
                });
                this.props.transformEnd();
                break;
            case 39: // right
                this.props.transformStart("translate");
                this.props.transform.translate({
                    x0: 0,
                    y0: 0,
                    x1: 2,
                    y1: 0
                });
                this.props.transformEnd();
                break;
            case 40: // down
                this.props.transformStart("translate");
                this.props.transform.translate({
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 2
                });
                this.props.transformEnd();
                break;
            case 37: // left
                this.props.transformStart("translate");
                this.props.transform.translate({
                    x0: 0,
                    y0: 0,
                    x1: -2,
                    y1: 0
                });
                this.props.transformEnd();
                break;
        }
    };

    mouseUpHandler = event => {
        this.mouseIsDown = false;
        let uuid = uuidv4();
        if (this.props.clamping && this.dragging) { // an object will be created TODO or selected
            this.props.clampEnd();
            switch (this.props.mode) {
                case OBJECT.RECT:
                    this.props.addObject( // TODO named Prototypes nutzen für proptypes?
                        // Hash, der key ist die UUID, darunter ist ein Objekt (oder ein ein weiteres Hash), dass die Daten enthält. Daraus werden in den Objektkomponenten die Elemente erstellt
                        // Oder: React-Komponenten für Objekte so lassen wie sie sind und immer wieder in dieser Rendermethode neu aufrufen
                        {
                            type: OBJECT.RECT,
                            uuid: uuid,
                            moniker: "Rechteck",
                            x: this.mouseXDown,
                            y: this.mouseYDown,
                            angle: 0,
                            pattern: {
                                template: this.props.texture,
                                angle: 0,
                                scaleX: 1,
                                scaleY: 1
                            },
                            fill: this.props.fill,
                            width: this.state.mouseXDrag - this.mouseXDown,
                            height: this.state.mouseYDrag - this.mouseYDown
                        },
                    );

                    this.lastUuid = uuid; // TODO was besseres finden. oder ist etwas besseres notwendig?
                    this.setState({showContext: true});
                    break;
                case OBJECT.LABEL:
                    this.props.addObject( // TODO named Prototypes nutzen für proptypes?
                        // Hash, der key ist die UUID, darunter ist ein Objekt (oder ein ein weiteres Hash), dass die Daten enthält. Daraus werden in den Objektkomponenten die Elemente erstellt
                        // Oder: React-Komponenten für Objekte so lassen wie sie sind und immer wieder in dieser Rendermethode neu aufrufen
                        {
                            type: OBJECT.LABEL,
                            uuid: uuid,
                            text: "Beschriftung",
                            x: this.mouseXDown,
                            y: this.mouseYDown,
                            angle: 0,
                            position: "left-top",
                            isKey: false, // false
                            displayDots: true,
                            displayLetters: true,
                            keyVal: 'Bschr', // ''
                            width: this.state.mouseXDrag - this.mouseXDown,
                            height: this.state.mouseYDrag - this.mouseYDown
                        },
                    );
                    break;
                default:
                    break;
            }

            setTimeout(() => {
                this.props.select(uuid);
            }, 0);
        }

        if (this.props.transform.hasOwnProperty(this.props.mode)) {
            this.props.transformEnd();
        }

        this.dragging = false;

        // TODO: side effect, should be handled by a saga
        this.triggerCache();
    };

    mouseMoveHandler = (event) => {
        // erst if (this.mouseIsDown) {}, dann spar ich mir die ganzen Funktionsaufrufe

        const currentX = this.currentX(event.clientX);
        const currentY = this.currentY(event.clientY);
        const moved = Math.abs(this.mouseXDown - currentX) > 3 || Math.abs(this.mouseYDown - currentY) > 3;
        if (this.mouseIsDown && moved) {
            this.dragging = true;
            this.setState({
                mouseXDrag: currentX,
                mouseYDrag: currentY
            })
        }

        if (this.dragging && this.props.transform.hasOwnProperty(this.props.mode)) {
            this.props.transform[this.props.mode]({
                x0: this.mouseXDown, // TODO muss nur einmal bei transform_start mitgegeben werden
                y0: this.mouseYDown, // dito
                x1: this.state.mouseXDrag,
                y1: this.state.mouseYDrag
            });
        }
    };

    static OBJECTS = (props, index) => ({
        //TODO drüber nachdenken: onClick zur Selektion hier implementieren?
        // Dann müssen Objekte in Gruppen das Event nicht abdelegieren um zu überprüfen,
        // dass nicht sie alleine sondern ihre Gruppe ausgewählt worden ist.
        [OBJECT.RECT]: <Rect key={index} {...props} />,
        [OBJECT.LABEL]: <Label key={index} {...props} />,
    });

    triggerCache = debounce(() => {
        this.props.cacheSVG(this.svgElement.current.innerHTML, this.props.currentPage);
    }, 500);

    render() {
        let objects = this.props.openedFile.pages[this.props.currentPage].objects.map((object, index) => {
            return InteractiveSVG.OBJECTS(object, index)[object.type];
        });

        return (
            <div style={{position: "relative"}}>
                <svg
                    xmlns={"http://www.w3.org/2000/svg"}
                    width={this.props.width}
                    id={"_SVG"}
                    height={this.props.height}
                    onMouseDown={event => {
                        this.mouseDownHandler(event)
                    }}
                    onKeyDown={event => {
                        this.keyDownHandler(event)
                    }}
                    onMouseUp={event => {
                        this.mouseUpHandler(event)
                    }}
                    onMouseMove={event => {
                        this.mouseMoveHandler(event)
                    }}
                    onInput={event => {
                        this.onInputHandler(event)
                    }}
                    ref={this.svgElement}
                    tabIndex={0}
                    style={{backgroundColor: "rgba(255,255,255,.5)"}}>

                    {objects}

                    {/*<Manipulator> muss hier stehen, um immer über allen anderen Objekten zu sein.*/}
                    <Manipulator
                        dragging={this.dragging}
                        mouseXDown={this.mouseXDown}
                        mouseXDrag={this.state.mouseXDrag}
                        mouseYDown={this.mouseYDown}
                        mouseYDrag={this.state.mouseYDrag}
                    />


                    {this.dragging && !this.props.transform.hasOwnProperty(this.props.mode) &&
                    <rect
                        x={this.mouseXDown}
                        y={this.mouseYDown}
                        fill={'rgba(0,0,255,0.1)'}
                        stroke={'rgba(0,0,255,0.2)'}
                        strokeWidth={'2px'}
                        width={this.state.mouseXDrag - this.mouseXDown}
                        height={this.state.mouseYDrag - this.mouseYDown}/>
                    }
                </svg>
                {this.state.showContext &&
                <ContextOptions
                    uuid={this.lastUuid}
                    x={this.state.mouseXDrag}
                    y={this.state.mouseYDrag} />
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {...state.editor}
};

const mapDispatchToProps = dispatch => {
    return {
        addObject: (object, pattern) => {
            dispatch({
                type: 'OBJECT_ADDED',
                object,
                pattern
            });
        },
        transform: {
            rotate: coords => {
                dispatch({
                    type: 'OBJECT_ROTATED',
                    coords
                });
            },
            translate: coords => {
                dispatch({
                    type: 'OBJECT_TRANSLATED',
                    coords
                });
            }
        },
        transformEnd: () => {
            dispatch({
                type: 'TRANSFORM_END'
            })
        },
        transformStart: transform => {
            dispatch({
                type: 'TRANSFORM_START',
                transform
            })
        },
        cacheSVG: (markup, pageNumber) => {
            dispatch({
                type: 'CACHE_SVG',
                markup,
                pageNumber
            });
        },
        unselect: () => {
            dispatch({
                type: 'OBJECT_SELECTED',
                uuid: null
            });
        },
        select: uuid => {
            dispatch({
                type: 'OBJECT_SELECTED',
                uuid: uuid
            });
        },
        clampStart: () => {
            dispatch({
                type: 'CLAMP_START'
            });
        },
        clampEnd: () => {
            dispatch({
                type: 'CLAMP_END'
            });
        },
        changeProp: (uuid, prop, value) => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                uuid,
                prop,
                value
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveSVG);