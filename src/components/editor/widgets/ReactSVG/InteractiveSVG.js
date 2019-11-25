import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Manipulator from "./Manipulator";

import {debounce} from "lodash";

import SVGRect, {Rect} from "./Rect";
import {OBJECT} from "../../constants";
import Label from "./Label";
import uuidv4 from "../../../../utility/uuid";
import ContextOptions from "./ContextOptions";
import {find} from "lodash";

window.rerender = 0;

class InteractiveSVG extends Component {
    svgElement = React.createRef();
    state = {
        showContext: false,
        dragging: false,
        mouseIsDown: false,
        mouseOffsetX: 0,
        mouseOffsetY: 0,
        mouseDownX: 0,
        mouseDownY: 0
    };
    lastUuid = null;

    currentX = eventX => {
        return eventX - this.svgElement.current.getBoundingClientRect().left;
    };
    currentY = eventY => {
        return eventY - this.svgElement.current.getBoundingClientRect().top;
    };

    onInputHandler = event => {
        event.target.tagName === "TEXTAREA" && // oh look, it is an editable label!
        this.props.changeProp(this.props.ui.selectedObjects[0], 'text', event.target.value, this.props.ui.currentPage);
    };

    keyDownHandler = event => {
        // const selectedObject = find(this.props.file.pages[this.props.currentPage].objects, {uuid: this.props.selectedObjects[0]});

        switch (event.which) {// TODO use constants instead of magic numbers
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

    mouseDownHandler = event => {
        let originator = event.nativeEvent.path[0].dataset.role;

        this.setState({
            showContext: false,
            mouseDownX: this.currentX(event.clientX),
            mouseDownY: this.currentY(event.clientY),
            mouseIsDown: true
        });

        console.log(originator);
        switch (originator) {
            case '__canvas': // this.svgElement.current.id
                this.props.unselect();
                this.props.clampStart();
                break;
            case '__rotate':
                this.props.transformStart("rotate");
                break;
            default: // TODO Sollten Objekte selbst handhaben
                this.props.transformStart("translate");
                // if (id.includes("editable")) { // editable pane of label was clicked
                //     this.props.select(id.slice(9));
                // } else if (id.includes("braille")) { // braille of label was clicked
                //     this.props.select(id.slice(8));
                // } else {
                //     this.props.select(id);
                // }
                //
                // this.props.transformStart("translate");
                // // ein tatsächliches Objekt wurde geklickt
                break;
        }

    };

    mouseUpHandler = event => {
        if (this.state.dragging) console.log("drag end");
        this.setState({
            mouseIsDown: false,
            dragging: false
        });
        console.log("-- mouse up");

        if (this.props.ui.clamping && this.state.dragging) { // an object will be created TODO or selected
            this.props.clampEnd();

            switch (this.props.ui.mode) {
                case 'rect':
                    let rect = new Rect(
                        this.state.mouseDownX, this.state.mouseDownY,
                        this.state.mouseOffsetX - this.state.mouseDownX,
                        this.state.mouseOffsetY - this.state.mouseDownY,
                        this.props.ui.fill,
                        this.props.ui.texture,
                        "Rechteck");
                    rect.type = "rect"; // TODO doch kein Objekt mehr

                    this.props.addObject(rect, this.props.ui.currentPage);
                    this.lastUuid = rect.uuid;
                    // this.props.select(rect.uuid);

                    // TODO was besseres finden. oder ist etwas besseres notwendig?
                    // this.setState({showContext: true});
                    break;
                // case OBJECT.LABEL:
                //     this.props.addObject( // TODO named Prototypes nutzen für proptypes?
                //         // Hash, der key ist die UUID, darunter ist ein Objekt (oder ein ein weiteres Hash), dass die Daten enthält. Daraus werden in den Objektkomponenten die Elemente erstellt
                //         // Oder: React-Komponenten für Objekte so lassen wie sie sind und immer wieder in dieser Rendermethode neu aufrufen
                //         {
                //             type: OBJECT.LABEL,
                //             uuid: uuid,
                //             text: "Beschriftung",
                //             x: this.mouseDownX,
                //             y: this.mouseDownY,
                //             angle: 0,
                //             position: "left-top",
                //             isKey: false, // false
                //             displayDots: true,
                //             displayLetters: true,
                //             keyVal: 'Bschr', // ''
                //             width: this.state.mouseXDrag - this.mouseDownX,
                //             height: this.state.mouseYDrag - this.mouseDownY
                //         },
                //         this.props.ui.currentPage
                //     );
                //     break;
                default:
                    break;
            }

            setTimeout(() => {
                // this.props.select(rect.uuid);
            }, 0);
        }

        if (this.props.hasOwnProperty(this.props.ui.mode)) {
            this.props.transformEnd();
        }

        // TODO: side effect, should be handled by a saga
        // this.triggerCache();
    };

    mouseMoveHandler = event => {
        if (this.state.mouseIsDown) {
            let moved = Math.abs(this.state.mouseDownX - this.state.mouseOffsetX) > 3 || Math.abs(this.state.mouseDownY - this.state.mouseOffsetY) > 3;

            if (moved && !this.state.dragging) {
                this.setState({dragging: true});
            }

            let mouseOffsetX = this.currentX(event.clientX);
            let mouseOffsetY = this.currentY(event.clientY);

            if (this.state.dragging) {
                switch (this.props.ui.mode) {
                    case 'translate':
                        this.props.translate({
                            x: mouseOffsetX - this.state.mouseOffsetX,
                            y: mouseOffsetY - this.state.mouseOffsetY
                        }, this.props.ui.currentPage, this.props.ui.selectedObjects);
                        break;
                    case 'rotate':
                        this.props.rotate({
                            originX: this.state.mouseDownX,
                            originY: this.state.mouseDownY,
                            offsetX: this.state.mouseOffsetX,
                            offsetY: this.state.mouseOffsetY
                        }, this.props.ui.currentPage, this.props.ui.selectedObjects);
                        break;
                    case 'scale':

                        break;
                    default:

                        break;
                }
            }

            this.setState({
                mouseOffsetX,
                mouseOffsetY
            });
        }
    };

    static OBJECTS = (props, index) => ({
        Rect: <SVGRect key={index} {...props} />,
        Label: <Label key={index} {...props} />,
    });

    triggerCache = debounce(() => {
        this.props.cacheSVG(this.svgElement.current.innerHTML, this.props.ui.currentPage);
    }, 500);

    render() {
        return (
            <div style={{position: "relative"}}>
                <pre style={{position: 'absolute', fontSize: '8pt', margin: "6px"}}>
                    offset x: {this.state.mouseOffsetX}<br/>
                    offset y: {this.state.mouseOffsetY}<br/>
                    origin x: {this.state.mouseDownX}<br/>
                    origin y: {this.state.mouseDownY}<br/>
                    render cycles: {window.rerender}<br/>

                    {this.state.dragging && "dragging"}&emsp;
                    {this.state.mouseIsDown && "mouseIsDown"}
                </pre>
                <svg
                    xmlns={"http://www.w3.org/2000/svg"}
                    width={this.props.ui.width}
                    data-role={"__canvas"}
                    height={this.props.ui.height}
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
                    onMouseLeave={event => {
                        this.mouseUpHandler(event)
                    }}
                    onInput={event => {
                        this.onInputHandler(event)
                    }}
                    ref={this.svgElement}
                    tabIndex={0}
                    style={{backgroundColor: "rgba(255,255,255,.5)"}}>

                    {
                        this.props.file.pages[this.props.ui.currentPage].objects.map((object, index) => {
                            return InteractiveSVG.OBJECTS(object, index)[object.constructor.name];
                        })
                    }


                    {/*<Manipulator> muss hier stehen, um immer über allen anderen Objekten zu sein.*/}
                    <Manipulator/>


                    {this.state.dragging && !this.props.hasOwnProperty(this.props.ui.mode) &&
                    <rect
                        x={this.state.mouseDownX}
                        y={this.state.mouseDownY}
                        fill={'rgba(0,0,255,0.06)'}
                        stroke={'rgba(0,0,255,0.1)'}
                        strokeWidth={'2px'}
                        width={this.state.mouseOffsetX - this.state.mouseDownX}
                        height={this.state.mouseOffsetY - this.state.mouseDownY}/>
                    }
                </svg>
                {this.state.showContext &&
                <ContextOptions
                    uuid={this.lastUuid}
                    x={this.state.mouseOffsetX}
                    y={this.state.mouseOffsetY}/>
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
        addObject: (object, currentPage) => {
            dispatch({
                type: 'OBJECT_ADDED',
                object,
                currentPage
            });
        },
        rotate: (coords, currentPage, selectedObjects) => {
            dispatch({
                type: 'OBJECT_ROTATED',
                coords,
                currentPage,
                uuids: selectedObjects
            });
        },
        translate: (coords, currentPage, selectedObjects) => {
            dispatch({
                type: 'OBJECT_TRANSLATED',
                coords,
                currentPage,
                uuids: selectedObjects
            });
        },
        scale: (coords, currentPage, selectedObjects) => {
            console.log("scale");
            dispatch({
                type: 'OBJECT_SCALED',
                coords,
                currentPage,
                uuids: selectedObjects
            });
        },
        transformEnd: () => {
            dispatch({
                type: 'TRANSFORM_END'
            })
        },
        transformStart: (transform, uuids) => {
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
        changeProp: (uuid, prop, value, currentPage) => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                uuid,
                prop,
                value,
                currentPage
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveSVG);