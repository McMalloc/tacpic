import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Manipulator from "./Manipulator";

import {debounce} from "lodash";

import Rect from "./Rect";
import {OBJECT} from "../../constants";
import Label from "./Label";
import patternTemplates from "./Patterns";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class InteractiveSVG extends Component {
    svgElement = React.createRef();
    state = {
        mouseXDrag: 0,
        mouseYDrag: 0,
    };

    mouseXDown = null; // in den state packen
    mouseYDown = null;
    dragging = false;
    mouseIsDown = false;

    currentX = eventX => {        return eventX - this.svgElement.current.getBoundingClientRect().left;    };
    currentY = eventY => {        return eventY - this.svgElement.current.getBoundingClientRect().top;    };

    mouseDownHandler = (event) => {
        console.log("down");
        this.mouseXDown = this.currentX(event.clientX); // todo zum State machen
        this.mouseYDown = this.currentY(event.clientY);
        this.mouseIsDown = true;
    };

    mouseUpHandler = () => {
        console.log("up");
        this.mouseIsDown = false;
        let uuid = uuidv4();
        if (this.dragging) {
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
                    break;
                case OBJECT.LABEL:
                    this.props.addObject( // TODO named Prototypes nutzen für proptypes?
                        // Hash, der key ist die UUID, darunter ist ein Objekt (oder ein ein weiteres Hash), dass die Daten enthält. Daraus werden in den Objektkomponenten die Elemente erstellt
                        // Oder: React-Komponenten für Objekte so lassen wie sie sind und immer wieder in dieser Rendermethode neu aufrufen
                        {
                            type:   OBJECT.LABEL,
                            uuid:   uuid,
                            text:   "Beschriftung",
                            x:      this.mouseXDown,
                            y:      this.mouseYDown,
                            angle:  0,
                            position: "left-top",
                            isKey:  false, // false
                            displayDots: true,
                            displayLetters: true,
                            keyVal: 'Bschr', // ''
                            width:  this.state.mouseXDrag - this.mouseXDown,
                            height: this.state.mouseYDrag - this.mouseYDown
                        },
                    );
                    break;
                default:
                    break;
            }
        } else {
            this.props.unselect();
        }
        if (this.props.transform.hasOwnProperty(this.props.mode)) {
            this.props.transformEnd();
        }
        this.dragging = false;

        this.triggerCache();
    };

    mouseMoveHandler = (event) => {
        const currentX = this.currentX(event.clientX);
        const currentY = this.currentY(event.clientY);
        const moved = Math.abs(this.mouseXDown - currentX) > 5 || Math.abs(this.mouseYDown - currentY) > 5;
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
            <svg
                xmlns={"http://www.w3.org/2000/svg"}
                width={this.props.width}
                height={this.props.height}
                onMouseDown={ event => {this.mouseDownHandler(event)}}
                onMouseUp={ event => {this.mouseUpHandler(event)}}
                onMouseMove={ event => {this.mouseMoveHandler(event)}}
                ref={this.svgElement}
                style={{backgroundColor: "white"}}>

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
                        fill={'rgba(0,0,255,0.01)'}
                        stroke={'rgba(0,0,255,0.2)'}
                        strokeWidth={'2px'}
                        width={this.state.mouseXDrag - this.mouseXDown}
                        height={this.state.mouseYDrag - this.mouseYDown} />
                }
            </svg>
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
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveSVG);