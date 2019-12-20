import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Manipulator from "./Manipulator";

import mapObject from "./index";
import uuidv4 from "../../../../utility/uuid";
import ContextOptions from "./ContextOptions";
import {switchCursorMode} from "../../../../actions";
import PathIndicator from "./PathManipulator";

import styled from 'styled-components';
import SVGGroup from "./Group";

window.rerender = 0;

const Indicator = styled.div`
    display: inline-block;
    padding: 2px;
    margin-right: 2px;
    margin-top: 2px;
    border: 1px solid grey;
    border-radius: 2px;
`;

class InteractiveSVG extends Component {
    svgElement = React.createRef();
    state = {
        showContext: false,

        dragging: false,
        mouseIsDown: false,
        openPath: false,
        pathClosing: false,
        lastUuid: null,
        actuallyMoved: false,
        transform: null, // transform mode while dragging the cursor

        mouseOffsetX: 0,
        mouseOffsetY: 0,
        mouseDownX: 0,
        mouseDownY: 0
    };

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
        /*
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
            }*/
    };

    mouseDownHandler = event => {
        let target = event.nativeEvent.path[0];
        // check if a group was the actual target since the event first fires
        // on visible elements, and later bubbles up to the group
        for (let i = 0; i < event.nativeEvent.path.length; i++) {
            let element = event.nativeEvent.path[i];
            if (element.dataset && element.dataset.group) {
                target = event.nativeEvent.path[i];
                break;
            }
        }

        const mouseDownX = this.currentX(event.clientX);
        const mouseDownY = this.currentY(event.clientY);

        // TODO: transparenten Manipulator abfangen
        // transform sollte auch bei einem klick auf den manipulator funktionieren, für gruppen

        if (target.dataset.role === 'CANVAS') {
            this.props.unselect();
        }

        if (target.dataset.role === 'ROTATE') {
            this.setState({transform: 'rotate'});
        }

        if (target.dataset.selectable) {
            this.props.select([target.id]);
        }

        if (target.dataset.transformable) { // TODO sinnig?
            console.log(event.nativeEvent.path);
            this.setState({transform: 'translate'});
        }

        if (this.props.ui.tool === 'PATH' && this.state.openPath) { // add additional vertices
            let pathClosing = target.dataset.role === 'CLOSE_PATH';
            this.setState({pathClosing});

            this.props.addPoint({
                kind: 'Q',
                coords: [
                    mouseDownX,
                    mouseDownY
                ]
            }, this.state.lastUuid, pathClosing);
        }

        this.setState({
            showContext: false,
            mouseIsDown: true,
            mouseDownX, mouseDownY
        });
    };

    mouseUpHandler = event => {
        if (this.state.transform === null) {
            switch (this.props.ui.tool) {
                case 'RECT':
                    if (this.state.dragging) { // custom
                        this.props.addObject({
                            // TODO in die reducer packen?
                            uuid: uuidv4(),
                            x: this.state.mouseDownX,
                            y: this.state.mouseDownY,
                            width: Math.abs(this.state.mouseOffsetX - this.state.mouseDownX),
                            height: Math.abs(this.state.mouseOffsetY - this.state.mouseDownY),
                            fill: this.props.ui.fill,
                            pattern: {
                                template: this.props.ui.texture,
                                angle: 0,
                                scaleX: 1,
                                scaleY: 1
                            },
                            moniker: "Rechteck",
                            angle: 0,
                            type: 'rect'
                        }, this.props.ui.currentPage);
                    } else {
                        // default sizes
                    }

                    break;
                case 'PATH':
                    if (!this.state.openPath) {
                        let uuid = uuidv4();
                        this.props.addObject({
                            uuid: uuid,
                            x: 0,
                            angle: 0,
                            y: 0,
                            moniker: "Pfad",
                            points: [
                                {
                                    kind: 'M',
                                    coords: [
                                        this.state.mouseOffsetX,
                                        this.state.mouseOffsetY
                                    ]
                                }
                            ],
                            type: 'path'
                        }, this.props.ui.currentPage);

                        this.setState({
                            openPath: true,
                            lastUuid: uuid
                        });
                    } else {
                        if (this.state.pathClosing) {
                            this.setState({
                                openPath: false,
                                pathClosing: false,
                                lastUuid: null
                            });
                        }

                        this.props.addPoint({
                            kind: '',
                            coords: [
                                this.state.mouseOffsetX,
                                this.state.mouseOffsetY
                            ]
                        }, this.state.lastUuid);
                    }
                    break;
                case 'SELECT':
                    if (!this.state.dragging) break;
                    const bounded = (object, originX, originY, dragX, dragY) => {
                        // TODO: invertiertes Auswahlwerkzeug
                        // TODO: in Objektfunktionen
                        let bbox = document.getElementById(object.uuid).getBBox();
                        let x1 = bbox.x + object.x,
                            x2 = x1 + bbox.width,
                            y1 = bbox.y + object.y,
                            y2 = y1 + bbox.height;

                        return x1 >= originX && x2 <= dragX && y1 >= originY && y2 <= dragY;
                    };

                    let selectedObjects = this.props.file.pages[this.props.ui.currentPage].objects.filter((object, index) => {
                        return bounded(
                            object,
                            this.state.mouseDownX,
                            this.state.mouseDownY,
                            this.state.mouseOffsetX,
                            this.state.mouseOffsetY
                        );
                    });
                    this.props.select(selectedObjects.map(object => {return object.uuid}));
                    break;
                default:
                    break;
            }
        }

        this.setState({
            mouseIsDown: false,
            dragging: false,
            transform: null
        });
    };

    mouseMoveHandler = event => {
        if (!this.state.dragging && this.state.mouseIsDown) {
            this.setState({
                dragging: true
            });
        }

        const mouseOffsetX = this.currentX(event.clientX);
        const mouseOffsetY = this.currentY(event.clientY);

        this.setState({mouseOffsetX, mouseOffsetY});

        if (this.state.transform !== null) {
            this.props[this.state.transform]({
                x: mouseOffsetX - this.state.mouseOffsetX,
                y: mouseOffsetY - this.state.mouseOffsetY
            }, this.props.ui.currentPage, this.props.ui.selectedObjects);
        }
    };

    render() {
        return (
            <div style={{position: "relative"}}>
                <svg
                    xmlns={"http://www.w3.org/2000/svg"}
                    width={this.props.ui.width}
                    data-role={"CANVAS"}
                    height={this.props.ui.height}
                    onMouseDown={this.mouseDownHandler}
                    onKeyDown={this.keyDownHandler}
                    onMouseUp={this.mouseUpHandler}
                    onMouseMove={this.mouseMoveHandler}
                    // onMouseLeave={this.mouseUpHandler} bessere Prozedur
                    onInput={this.onInputHandler}
                    ref={this.svgElement}
                    tabIndex={0}
                    style={{backgroundColor: "rgba(255,255,255,.5)"}}>

                    {
                        this.props.file.pages[this.props.ui.currentPage].objects.map((object, index) => {
                            return mapObject(object, index);
                        })
                    }

                    <Manipulator/>

                    {this.props.ui.tool === 'PATH' && this.state.lastUuid !== null && // TODO: component should be aware itself if there is nothing to draw
                    <PathIndicator
                        uuid={this.state.lastUuid}
                        currentX={this.state.mouseOffsetX}
                        currentY={this.state.mouseOffsetY}/>
                    }


                    {/*TODO bisher nur RECT, auch relevant für andere TOOLs (LABEL, SELECT, ...) */}
                    {this.state.dragging && this.state.transform === null && (this.props.ui.tool === 'RECT' || this.props.ui.tool === 'SELECT') &&
                    <rect
                        x={this.state.mouseDownX}
                        y={this.state.mouseDownY}
                        fill={'rgba(0,0,255,0.02)'}
                        stroke={'rgba(0,50,255,0.3)'}
                        strokeWidth={'1px'}
                        width={this.state.mouseOffsetX - this.state.mouseDownX}
                        height={this.state.mouseOffsetY - this.state.mouseDownY}/>
                    }
                </svg>
                {this.state.showContext &&
                <ContextOptions
                    uuid={this.state.lastUuid}
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
        switchCursorMode: mode => {
            dispatch(switchCursorMode(mode));
        },
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
                uuids: [null]
            });
        },
        select: uuids => {
            dispatch({
                type: 'OBJECT_SELECTED',
                uuids
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
        },
        addPoint: (point, uuid, circular) => {
            dispatch({
                type: 'PATH_POINT_ADDED',
                point, uuid, circular
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveSVG);