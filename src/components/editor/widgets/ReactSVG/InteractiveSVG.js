import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Manipulator from "./Manipulator";

import mapObject from "./index";
import ContextOptions from "./ContextOptions";
import {switchCursorMode} from "../../../../actions";
import PathIndicator from "./PathManipulator";

import styled from 'styled-components';
import methods, {combineBBoxes} from "./methods";
import {init, transformCoords} from "./transform";
import SVGGrid from "./Grid";
import {findObject} from "../../../../utility/findObject";

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
        preview: null,
        transform: null, // transform mode while dragging the cursor
        edit: null, // internal edit modes of certain tools whose state doesn't need
                    // to be communicated to the store (but the results will be of course)

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
        // unnötig, Event bubblet nicht
        // event.stopPropagation();
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

    onModeChange = uuid => {
        this.setState({
            edit: {uuid}
        })
    };

    mouseDownHandler = event => {
        // TODO FIREFOX: TypeError: event.nativeEvent.path is undefined
        //  src/components/editor/widgets/ReactSVG/InteractiveSVG.js:105
        // https://stackoverflow.com/questions/39245488/event-path-undefined-with-firefox-and-vue-js
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

        // transform mouse coordinates into svg viewbox
        let transformedCoords = transformCoords(event.clientX, event.clientY);
        const mouseDownX = transformedCoords.x;
        const mouseDownY = transformedCoords.y;

        // TODO: transparenten Manipulator abfangen
        //  transform sollte auch bei einem klick auf den manipulator funktionieren, für gruppen

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
        if (target.dataset.transformable) {
            // TODO nicht für Pfadsegmente
            this.setState({transform: 'translate'});
        }

        // Die Abfrage muss eventuell anders erfolgen: Ein Pfad ist eventuell auch geöffnet und bereits abgeschlossen,
        // außerdem ist ein bereits abgeschlossener Pfad vielleicht auch Ziel eines weiteren Vertex.
        // Allerdings: ein Klick auf den Canvas deselektiert im Moment ein Objekt.
        if (this.state.edit !== null) {
            if (target.dataset.role === 'EDIT-PATH') { // change vertices

                this.setState({
                    edit: {
                        index: parseInt(target.dataset.index),
                        param: parseInt(target.dataset.param),
                        uuid: this.state.edit.uuid
                    }
                })

            } else { // add additional vertices
                // TODO M lässt sich nicht verschieben, weil ein Klick darauf zum Schließen
                //  des Pfades registriert wird
                // TODO Schließen des Pfades durch Klick auf M muss den letzten Punkt auf M
                //  setzen
                let pathClosing = target.dataset.role === 'CLOSE-PATH';
                this.setState({pathClosing});

                let currentPath = findObject(this.props.file.pages[this.props.ui.currentPage].objects, this.state.edit.uuid); // TODO in externes Modul auslagern

                if (this.props.ui.tool === 'QUADRATIC') {
                    let appendedPath = methods.path.addPoint(
                        currentPath,
                        [mouseDownX, mouseDownY],
                        'Q');

                    this.setState({
                        edit: {
                            uuid: appendedPath.uuid,
                            index: appendedPath.points.length - 1,
                            param: 0
                        }
                    });

                    this.props.changeProp(appendedPath.uuid, 'points',
                        appendedPath.points
                    );
                } else if (this.props.ui.tool === 'CUBIC') {
                    let appendedPath = methods.path.addPoint(
                        currentPath,
                        [mouseDownX, mouseDownY],
                        'C');

                    this.setState({
                        edit: {
                            uuid: appendedPath.uuid,
                            index: appendedPath.points.length - 1,
                            param: 2
                        }
                    });

                    this.props.changeProp(appendedPath.uuid, 'points',
                        appendedPath.points
                    );
                }
            }


        }

        this.setState({
            showContext: false,
            mouseIsDown: true,
            mouseDownX, mouseDownY,
            t_mouseDownX: this.currentX(event.clientX),
            t_mouseDownY: this.currentY(event.clientY),
        });
    };

    mouseUpHandler = event => {
        // TODO create-Methoden in methods.js stecken bzw. einem Objektmodul
        if (this.state.transform === null) {
            switch (this.props.ui.tool) {
                case 'ELLIPSE':
                    // TODO default Größe einbauen
                    if (this.state.preview !== null) { // custom
                        this.props.addObject(
                            this.state.preview
                        );
                    }
                    break;
                case 'RECT':
                    // TODO default Größe einbauen
                    if (this.state.dragging) { // custom
                        this.props.addObject(
                            methods.rect.create(
                                this.state.mouseDownX,
                                this.state.mouseDownY,
                                Math.abs(this.state.mouseOffsetX - this.state.mouseDownX),
                                Math.abs(this.state.mouseOffsetY - this.state.mouseDownY),
                                this.props.ui.texture, this.props.ui.fill
                            )
                        );
                    }
                    break;
                case 'CUBIC':
                case 'QUADRATIC':
                    if (this.state.edit === null) {
                        let path = methods.path.create(
                            this.state.mouseDownX,
                            this.state.mouseDownY,
                            this.props.ui.texture,
                            this.props.ui.fill
                        );
                        this.props.addObject(path);

                        this.setState({
                            edit: {uuid: path.uuid}
                        });
                    } else { // a path is open and is being edited
                        if (this.state.pathClosing) {
                            this.setState({
                                pathClosing: false,
                                edit: null
                            });
                        }
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
                    let label = methods.label.create(
                        this.state.mouseDownX,
                        this.state.mouseDownY,
                        Math.abs(this.state.mouseOffsetX - this.state.mouseDownX),
                        Math.abs(this.state.mouseOffsetY - this.state.mouseDownY)
                    );

                    this.props.addObject(label);
                    setTimeout(() => {
                        document.getElementById("editable_" + label.uuid).focus();
                    }, 200);
                    break;
                default:
                    break;
            }
        }

        this.setState({
            mouseIsDown: false,
            dragging: false,
            transform: null,
            preview: null
        });
    };

    mouseMoveHandler = event => {
        let transformedCoords = transformCoords(event.clientX, event.clientY);

        // TODO hier das snapping implementieren
        const mouseOffsetX = transformedCoords.x;
        const mouseOffsetY = transformedCoords.y;

        if (!this.state.dragging && this.state.mouseIsDown) {
            this.setState({
                dragging: true
            });
        }

        // preview for certain objects
        // TODO Mechanik kann benutzt werden für lagfreie Transformationen
        let type;
        if (this.props.ui.tool === 'ELLIPSE') type = 'ellipse';
        if (this.props.ui.tool === 'RECT') type = 'rect';
        if (type && this.state.dragging && this.state.transform === null && this.state.edit === null) {
            // create temporary preview object that will later be dispatched as-is to the store
            if (this.state.preview === null) {
                this.setState({
                    preview: methods[type].create(
                        this.state.mouseDownX,
                        this.state.mouseDownY,
                        Math.abs(this.state.mouseOffsetX - this.state.mouseDownX),
                        Math.abs(this.state.mouseOffsetY - this.state.mouseDownY),
                        this.props.ui.texture, this.props.ui.fill
                    )
                })
            } else {
                // update preview object
                let preview = {...this.state.preview};
                preview.width = Math.abs(this.state.mouseOffsetX - this.state.mouseDownX);
                preview.height = Math.abs(this.state.mouseOffsetY - this.state.mouseDownY);
                this.setState({preview});
            }
        }

        // TODO only update if relevant -- otherwise the state updates trigger a rerender at every move
        this.setState({
            mouseOffsetX, mouseOffsetY,
            t_mouseOffsetX: this.currentX(event.clientX),
            t_mouseOffsetY: this.currentY(event.clientY),
        });

        // apply transform to selected objects if transforming at all
        if (this.state.transform !== null) {
            this.props[this.state.transform]({
                x: mouseOffsetX - this.state.mouseOffsetX,
                y: mouseOffsetY - this.state.mouseOffsetY
            }, this.props.ui.selectedObjects);
        }

        if (this.state.transform === null && this.state.edit !== null && this.state.dragging) {
            // TODO cache currentPath, auch für PathManipulator,
            //  wenn dieser nur noch funktional ist
            let currentPath = findObject(this.props.file.pages[this.props.ui.currentPage].objects, this.state.edit.uuid);
            console.log(currentPath.x);
            console.log(mouseOffsetX);
            console.log(currentPath.points);
            this.props.changeProp(currentPath.uuid, 'points',
                methods.path.changePoint(
                    currentPath,
                    [mouseOffsetX - currentPath.x, mouseOffsetY - currentPath.y],
                    this.state.edit.index,
                    this.state.edit.param).points
            );
        }
    };

    render() {
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

                        <rect data-role={"CANVAS"} x={0} y={0}
                              width={this.props.file.width}
                              height={this.props.file.height}
                              stroke={'rgba(0,0,0,0.0)'} fill={'white'}/>
                        {
                            this.props.file.pages[this.props.ui.currentPage].objects.map((object, index) => {
                                return mapObject(object, index);
                            })
                        }

                        {this.state.preview !== null && this.state.dragging &&
                            mapObject(this.state.preview, -1)
                        }

                    </g>

                    {this.state.edit !== null &&
                    <PathIndicator
                        uuid={this.state.edit.uuid}
                        dragging={this.state.dragging}/>
                    }

                    <Manipulator
                        onModeChange={this.onModeChange}
                    />

                    {this.state.dragging && this.state.transform === null && this.state.edit === null &&
                    (this.props.ui.tool === 'SELECT' || this.props.ui.tool === 'LABEL') &&
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
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state.editor
    }
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
        changeProp: (uuid, prop, value) => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                uuid,
                prop,
                value
            });
        },
        // changePoint: uuid => {
        //     dispatch({
        //         type: 'PATH_POINT_CHANGED',
        //         uuid,
        //     })
        // }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveSVG);