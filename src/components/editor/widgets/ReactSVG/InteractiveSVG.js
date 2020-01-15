import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Manipulator from "./Manipulator";

import mapObject from "./index";
import uuidv4 from "../../../../utility/uuid";
import ContextOptions from "./ContextOptions";
import {switchCursorMode} from "../../../../actions";
import PathIndicator from "./PathManipulator";

import styled from 'styled-components';
import methods, {combineBBoxes} from "./methods";
import {init, transformCoords} from "./transform";
import SVGGrid from "./Grid";

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

    componentDidMount() {
        init(this.svgElement.current);
    }

    currentX = x => {
        return x - this.svgElement.current.getBoundingClientRect().left;
    };
    currentY = y => {
        return y - this.svgElement.current.getBoundingClientRect().top;
    };

    keyDownHandler = event => {
        event.stopPropagation();
        console.log(event.which);
        switch (event.which) {// TODO use constants instead of magic numbers
            case 38: // up
                this.props.changeViewport(
                    this.props.ui.scalingFactor,
                    this.props.ui.viewPortX,
                    this.props.ui.viewPortY - 10);
                break;
            case 39: // right
                this.props.changeViewport(
                    this.props.ui.scalingFactor,
                    this.props.ui.viewPortX + 10,
                    this.props.ui.viewPortY);
                break;
            case 40: // down
                this.props.changeViewport(
                    this.props.ui.scalingFactor,
                    this.props.ui.viewPortX,
                    this.props.ui.viewPortY + 10);
                break;
            case 37: // left
                this.props.changeViewport(
                    this.props.ui.scalingFactor,
                    this.props.ui.viewPortX - 10,
                    this.props.ui.viewPortY);
                break;
            case 187: // +
                this.props.changeViewport(
                    this.props.ui.scalingFactor + 0.1,
                    this.props.ui.viewPortX,
                    this.props.ui.viewPortY);
                break;
            case 189: // -
                this.props.changeViewport(
                    this.props.ui.scalingFactor - 0.1,
                    this.props.ui.viewPortX,
                    this.props.ui.viewPortY);
                break;
            case 46: // DEL
                this.props.remove(this.props.ui.selectedObjects);
                break;
            default:
                break;
        }
        return false;
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

        let transformedCoords = transformCoords(event.clientX, event.clientY);
        const mouseDownX = transformedCoords.x;
        const mouseDownY = transformedCoords.y;

        // TODO: transparenten Manipulator abfangen
        // transform sollte auch bei einem klick auf den manipulator funktionieren, für gruppen

        if (target.dataset.role === 'CANVAS') {
            this.props.unselect();
        }

        if (target.dataset.role === 'ROTATE') {
            this.setState({transform: 'rotate'});
        }

        if (target.dataset.role === 'SCALE') {
            this.setState({transform: 'scale'});
        }

        if (target.dataset.selectable) {
            this.props.select([target.id]);
        }

        if (target.dataset.transformable) { // TODO sinnig?
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
            lastMousedown: Date.now(),
            mouseDownX, mouseDownY,
            t_mouseDownX: this.currentX(event.clientX),
            t_mouseDownY: this.currentY(event.clientY),
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
                        });
                    } else {
                        // default sizes
                    }

                    break;
                case 'PATH':
                    if (!this.state.openPath) {
                        let uuid = uuidv4();
                        this.props.addObject({
                            uuid: uuid,
                            x: 0, // eigentlich: this.state.mouseDownX,
                            angle: 0,
                            y: 0, // eigentlich: this.state.mouseDownY,
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
                        });

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
                        // TODO: berechnet nicht korrekt, wenn Objekt rotiert ist
                        // TODO:
                        let bbox = methods[object.type].getBBox(object);
                        let x1 = bbox.x,
                            x2 = x1 + bbox.width,
                            y1 = bbox.y,
                            y2 = y1 + bbox.height;

                        return x1 >= originX && x2 <= dragX && y1 >= originY && y2 <= dragY;
                    };

                    let selectedObjects = this.props.file.pages[this.props.ui.currentPage].objects.filter((object, index) => {
                        return bounded(
                            object,
                            this.state.t_mouseDownX,
                            this.state.t_mouseDownY,
                            this.state.t_mouseOffsetX,
                            this.state.t_mouseOffsetY
                        );
                    });
                    this.props.select(selectedObjects.map(object => {
                        return object.uuid
                    }));
                    break;
                case 'LABEL':
                    if (!this.state.dragging) break;
                    let uuid = uuidv4();
                    this.props.addObject({
                        uuid: uuid,
                        x: this.state.mouseDownX,
                        y: this.state.mouseDownY,
                        width: Math.abs(this.state.mouseOffsetX - this.state.mouseDownX),
                        height: Math.abs(this.state.mouseOffsetY - this.state.mouseDownY),
                        text: 'Neue Beschriftung',
                        moniker: "Beschriftung",
                        displayDots: true,
                        displayLetters: true,
                        editMode: true,
                        isKey: false,
                        type: 'label'
                    });
                    setTimeout(() => {
                        document.getElementById("editable_" + uuid).focus();
                    }, 200);
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

        let transformedCoords = transformCoords(event.clientX, event.clientY);

        const mouseOffsetX = transformedCoords.x;
        const mouseOffsetY = transformedCoords.y;

        // TODO only update if relevant -- otherwise the state updates trigger a rerender at every move
        this.setState({
            mouseOffsetX, mouseOffsetY,
            t_mouseOffsetX: this.currentX(event.clientX),
            t_mouseOffsetY: this.currentY(event.clientY),
        });

        if (this.state.transform !== null) {
            this.props[this.state.transform]({
                x: mouseOffsetX - this.state.mouseOffsetX,
                y: mouseOffsetY - this.state.mouseOffsetY
            }, this.props.ui.selectedObjects);
        }
    };

    render() {
        // console.log("-- render --");
        return (
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <svg
                    xmlns={"http://www.w3.org/2000/svg"}
                    width={'100%'} height={'100%'}
                    data-role={"CANVAS"}
                    id={"MAIN-CANVAS"}
                    onMouseDown={this.mouseDownHandler}
                    onKeyDown={this.keyDownHandler}
                    onMouseUp={this.mouseUpHandler}
                    onMouseMove={this.mouseMoveHandler}
                    // onMouseLeave={this.mouseUpHandler} bessere Prozedur
                    onInput={this.keyDownHandler}
                    ref={this.svgElement}
                    tabIndex={0}
                    style={{backgroundColor: "rgba(0,0,0,0.08)", position: 'absolute'}}>

                    <g id={'VIEWBOX'}
                       style={{transition: 'transform 0.1s'}}
                       transform={`
                       translate(${this.props.ui.viewPortX} ${this.props.ui.viewPortY}) 
                       scale(${this.props.ui.scalingFactor})`}>

                        <rect data-role={"CANVAS"} x={0} y={0} width={this.props.file.width}
                              height={this.props.file.height} stroke={'rgba(0,0,0,0.0)'} fill={'white'}/>
                        {
                            this.props.file.pages[this.props.ui.currentPage].objects.map((object, index) => {
                                return mapObject(object, index);
                            })
                        }



                    </g>

                    <Manipulator/>

                    {this.state.dragging && this.state.transform === null && (this.props.ui.tool === 'RECT' || this.props.ui.tool === 'SELECT' || this.props.ui.tool === 'LABEL') &&
                    <g>
                        <rect
                            x={this.state.t_mouseDownX}
                            y={this.state.t_mouseDownY}
                            fill={'rgba(0,0,255,0.02)'}
                            stroke={'rgba(0,50,255,0.3)'}
                            strokeWidth={'1px'}
                            width={this.state.t_mouseOffsetX - this.state.t_mouseDownX}
                            height={this.state.t_mouseOffsetY - this.state.t_mouseDownY}/>
                        <text fill={'blue'} fontSize={8} x={this.state.t_mouseDownX} y={this.state.t_mouseDownY + 10}>
                            {parseInt(this.state.t_mouseDownX) + ", " +
                            parseInt(this.state.t_mouseDownY)}
                            {/*this.state.mouseOffsetX,*/}
                            {/*this.state.mouseOffsetY*/}
                        </text>
                    </g>
                    }

                    {this.props.ui.tool === 'PATH' && this.state.lastUuid !== null && // TODO: component should be aware itself if there is nothing to draw
                    <PathIndicator
                        uuid={this.state.lastUuid}
                        currentX={this.state.mouseOffsetX}
                        currentY={this.state.mouseOffsetY}/>
                    }

                    {this.svgElement.current !== null &&
                    <SVGGrid canvasWidth={this.svgElement.current.scrollWidth}
                             canvasHeight={this.svgElement.current.scrollHeight}
                             offsetX={this.props.ui.viewPortX % (this.props.file.verticalGridSpacing * this.props.ui.scalingFactor)}
                             offsetY={this.props.ui.viewPortY % (this.props.file.horizontalGridSpacing * this.props.ui.scalingFactor)}
                             verticalGridSpacing={this.props.file.verticalGridSpacing * this.props.ui.scalingFactor}
                             horizontalGridSpacing={this.props.file.horizontalGridSpacing * this.props.ui.scalingFactor}/>
                    }

                    {/*<g id={"mouse-indicators"}>*/}
                    {/*    {this.props.ui.scalingFactor !== 1 &&*/}
                    {/*    <g>*/}
                    {/*        <line x1={this.state.mouseOffsetX}*/}
                    {/*              y1={0} x2={this.state.mouseOffsetX}*/}
                    {/*              y2={this.state.mouseOffsetY - 2} stroke={'grey'} strokeWidth={0.5}/>*/}
                    {/*        <text fontSize={8} x={this.state.mouseOffsetX + 2} y={this.state.mouseOffsetY - 8}>*/}
                    {/*            {parseInt(this.state.mouseOffsetX)} document space</text>*/}

                    {/*        <line x1={0}*/}
                    {/*              y1={this.state.mouseOffsetY} x2={this.state.mouseOffsetX - 2}*/}
                    {/*              y2={this.state.mouseOffsetY} stroke={'grey'} strokeWidth={0.5}/>*/}
                    {/*        <text fontSize={8} y={this.state.mouseOffsetY + 10} x={this.state.mouseOffsetX - 20}>*/}
                    {/*            {parseInt(this.state.mouseOffsetY)}</text>*/}
                    {/*    </g>*/}
                    {/*    }*/}


                    {/*    <line x1={this.state.t_mouseOffsetX}*/}
                    {/*          y1={0} x2={this.state.t_mouseOffsetX}*/}
                    {/*          y2={this.state.t_mouseOffsetY - 2} stroke={'lightgreen'} strokeWidth={0.5}/>*/}
                    {/*    <text fill={'green'} fontSize={8} x={this.state.t_mouseOffsetX + 2} y={this.state.t_mouseOffsetY - 8}>*/}
                    {/*        {parseInt(this.state.t_mouseOffsetX)} user space</text>*/}

                    {/*    <line x1={0}*/}
                    {/*          y1={this.state.t_mouseOffsetY} x2={this.state.t_mouseOffsetX - 2}*/}
                    {/*          y2={this.state.t_mouseOffsetY} stroke={'lightgreen'} strokeWidth={0.5}/>*/}
                    {/*    <text fill={'green'} fontSize={8} y={this.state.t_mouseOffsetY + 10} x={this.state.t_mouseOffsetX - 20}>*/}
                    {/*        {parseInt(this.state.t_mouseOffsetY)}</text>*/}
                    {/*</g>*/}

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

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        switchCursorMode: mode => {
            dispatch(switchCursorMode(mode));
        },
        changeViewport: (scalingFactor, viewPortX, viewPortY) => {
            dispatch({
                type: 'CHANGE_VIEWPORT',
                scalingFactor, viewPortX, viewPortY
            });
        },
        addObject: object => {
            dispatch({
                type: 'OBJECT_ADDED',
                object
            });
        },
        rotate: (coords, selectedObjects) => {
            dispatch({
                type: 'OBJECT_ROTATED',
                coords,
                uuids: selectedObjects
            });
        },
        translate: (coords, selectedObjects) => {
            dispatch({
                type: 'OBJECT_TRANSLATED',
                coords,
                uuids: selectedObjects
            });
        },
        scale: (coords, selectedObjects) => {
            dispatch({
                type: 'OBJECT_SCALED',
                coords,
                uuids: selectedObjects
            });
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
        remove: uuids => {
            dispatch({
                type: 'OBJECT_REMOVED',
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