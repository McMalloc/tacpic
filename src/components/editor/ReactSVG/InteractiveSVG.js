import React, { Component, useState } from 'react'
import { connect } from "react-redux";
import Manipulator from "./Manipulator";
import ToolIndicator from "../ToolIndicator";

import { cloneDeep } from "lodash";
import mapObject from "./index";
import PathManipulator from "./PathManipulator";

import methods from "./methods/methods";
import { init, transformCoords } from "./transform";
import SVGGrid from "./Grid";
import { findObject } from "../../../utility/findObject";
import { SVGPage } from "./SVGPage";
import { ERROR_THROWN } from "../../../actions/action_constants";
import { TOOL_SENSIBILITY } from "../../../config/constants";
import styled from "styled-components/macro";

const SVG = styled.svg`
  width: ${props => props.scale * props.canvasWidth}px;
  /* width: 100%; */
  min-width: 100%;
  height: ${props => props.scale * props.canvasHeight}px;
  /* height: 100%; */
  min-height: 100%;
  touch-action: none;
  outline: none; 
  cursor: ${({ isPanning, tool }) => isPanning ? 'move' : tool === 'SELECT' ? 'inherit' : 'crosshair'};
  
  &:hover #tool-indicator {
    visibility: visible;
  }
`;

class InteractiveSVG extends Component {
    svgElement = React.createRef();
    state = {
        showContext: false,
        dragging: false,
        panning: false,
        panningRefX: 0,
        panningRefY: 0,
        modifierKey: null,
        mouseIsDown: false,
        canvasWidth: 0,
        canvasHeight: 0,
        // openPath: false,
        pathClosing: false,
        lastUuid: null,
        actuallyMoved: false,
        preview: null,
        transform: null, // transform mode while dragging the cursor
        edit: null, // internal edit modes of certain tools whose state doesn't need
        // to be communicated to the store (but the results will be of course)
        editIndex: -1,
        editParam: -1,
        selectedPoint: null,
        segmentStart: -1,
        mouseOffsetX: 0,
        mouseOffsetY: 0,
        mouseDownX: 0,
        mouseDownY: 0,
        lastMouseUpX: 0,
        lastMouseUpY: 0
    };

    componentDidMount() {
        init(this.svgElement.current); // creating reference point for later transformation
        const wrapperWidth = this.svgElement.current.getBoundingClientRect().width;
        const viewboxWidth = document.getElementById("VIEWBOX").getBoundingClientRect().width;
        const viewboxHeight = document.getElementById("VIEWBOX").getBoundingClientRect().height;

        const centeredOffset = wrapperWidth / 2 - viewboxWidth / 2;
        this.props.changeViewport(
            this.props.ui.scalingFactor,
            viewboxWidth > wrapperWidth ? 10 :
                wrapperWidth / 2 - viewboxWidth / 2 < 300 ?
                    Math.max(centeredOffset, wrapperWidth - viewboxWidth - 10) :
                    Math.min(centeredOffset, wrapperWidth - viewboxWidth - 10),
            this.props.ui.viewPortY);


        this.setState({ canvasWidth: 2 * viewboxWidth, canvasHeight: 2 * viewboxHeight })
    }

    currentX = x => x - this.svgElement.current.getBoundingClientRect().left;
    currentY = y => y - this.svgElement.current.getBoundingClientRect().top;

    wheelHandler = event => {
        if (this.state.modifierKey !== 32) return;
        let factor = event.nativeEvent.deltaY <= 0 ? 0.95 : 1.05;
        this.props.changeViewport(
            this.props.ui.scalingFactor + (event.nativeEvent.deltaY > 0 ? -0.1 : 0.1),
            this.props.ui.viewPortX,
            this.props.ui.viewPortY);
    };

    keyDownHandler = event => {
        switch (event.which) {// TODO use constants instead of magic numbers
            case 13: // ENTER
                if (this.state.preview === null) break;
                this.props.updateObject(this.state.preview);
                this.setState({
                    preview: null
                });
                break;
            case 32: // space
                if (this.state.modifierKey === 32) break;
                // event.stopPropagation();
                // event.preventDefault();
                this.setState({
                    modifierKey: 32
                })
                break;
            case 38: // up
                event.stopPropagation();
                event.preventDefault();
                this.props.changeViewport(
                    this.props.ui.scalingFactor,
                    this.props.ui.viewPortX,
                    this.props.ui.viewPortY - 10);
                break;
            case 39: // right
                event.stopPropagation();
                event.preventDefault();
                this.props.changeViewport(
                    this.props.ui.scalingFactor,
                    this.props.ui.viewPortX + 10,
                    this.props.ui.viewPortY);
                break;
            case 40: // down
                event.stopPropagation();
                event.preventDefault();
                this.props.changeViewport(
                    this.props.ui.scalingFactor,
                    this.props.ui.viewPortX,
                    this.props.ui.viewPortY + 10);
                break;
            case 37: // left
                event.stopPropagation();
                event.preventDefault();
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
                let selectedObject = findObject(
                    this.props.file.present.pages[this.props.ui.currentPage].objects,
                    this.props.ui.selectedObjects[0]);
                if (selectedObject.type === 'path' && this.state.editIndex >= 0) {
                    this.props.updateObject(methods.path.removePoint(cloneDeep(selectedObject), this.state.editIndex));
                    this.setState({ editIndex: -1 });
                } else {
                    this.props.remove(this.props.ui.selectedObjects);
                }
                break;
            default:
                break;
        }
        return false;
    };

    keyUpHandler = event => {
        event.stopPropagation();
        event.preventDefault();
        switch (event.which) {// TODO use constants instead of magic numbers
            case 32: // space
                this.setState({
                    modifierKey: null
                })
                break;
            default:
                break;
        }
        return false;
    };

    onModeChange = uuid => {
        this.setState({
            edit: { uuid }
        })
    };

    mouseDownHandler = event => {
        try {
            // TODO FIREFOX: TypeError: event.nativeEvent.path is undefined
            //  src/components/editor/widgets/ReactSVG/InteractiveSVG.js:105
            // https://stackoverflow.com/questions/39245488/event-path-undefined-with-firefox-and-vue-js
            let target = event.nativeEvent.target;
            // check if a group was the actual target since the event first fires
            // on visible elements, and later bubbles up to the group
            let path = event.nativeEvent.path || event.nativeEvent.composedPath();
            for (let i = 0; i < path.length; i++) {
                let element = path[i];
                if (element.dataset && element.dataset.group) {
                    target = path[i];
                    break;
                }
            }

            // transform mouse coordinates into svg viewbox
            let transformedCoords = transformCoords(event.clientX, event.clientY);
            const mouseDownX = parseInt(transformedCoords.x);
            const mouseDownY = parseInt(transformedCoords.y);

            this.setState({
                mouseIsDown: true,
                mouseDownX, mouseDownY,
                t_mouseDownX: this.currentX(event.clientX),
                t_mouseDownY: this.currentY(event.clientY),
            });

            // TODO: transparenten Manipulator abfangen
            //  transform sollte auch bei einem klick auf den manipulator funktionieren, für gruppen

            if (this.state.modifierKey === 32) { // space pressed
                this.setState({
                    panning: true,
                    panningRefX: this.props.wrapperRef.current.scrollLeft + event.pageX,
                    panningRefY: this.props.wrapperRef.current.scrollTop + event.pageY,
                });
                return;
            }

            let unselected = false;
            if (target.dataset.role === 'CANVAS') {
                unselected = true;
                this.props.ui.selectedObjects.length !== 0 && this.props.unselect();
                this.setState({
                    editIndex: -1
                });
            }

            let selectedId = null;
            if (this.props.ui.tool === 'SELECT' || !!target.dataset.selectOverride) {
                if (target.dataset.selectable) {
                    selectedId = target.dataset.uuid || target.id;
                    this.props.select([selectedId]);
                }
            } else { }

            if (target.dataset.role === 'ROTATE') this.setState({ transform: 'rotate' });
            if (target.dataset.role === 'SCALE') this.setState({ transform: 'scale' });
            if (target.dataset.start) this.setState({ pathClosing: true });

            if (target.dataset.transformable === "true" && this.props.ui.tool === 'SELECT') this.setState({ transform: 'translate' });

            if (target.dataset.role === 'EDIT-PATH') {
                this.setState({
                    edit: target.dataset.associatedPath,
                    preview: {
                        ...findObject(
                            this.props.file.present.pages[this.props.ui.currentPage].objects,
                            target.dataset.associatedPath)
                    },
                    editParam: parseInt(target.dataset.param),
                    editIndex: parseInt(target.dataset.index)
                })
            }

            if (this.state.preview === null || this.props.ui.tool !== 'PATH') { // create a new object and finalize started path
                if (this.props.ui.tool !== 'PATH') {
                    this.props.updateObject(this.state.preview);
                    this.setState({preview: null});
                }
                switch (this.props.ui.tool) {
                    case 'ELLIPSE':
                    case 'RECT':
                        // check if either a previously selected object or the object selected in this callback is relevant
                        // for transformation
                        let uuid = selectedId === null ?
                            (this.props.ui.selectedObjects.length === 0 ? null : this.props.ui.selectedObjects[0])
                            : selectedId;

                        if (uuid === null || unselected) { // nothing is selected
                            this.setState({
                                preview: methods[this.props.ui.tool.toLowerCase()].create(
                                    Math.min(mouseDownX, this.state.mouseOffsetX),
                                    Math.min(mouseDownY, this.state.mouseOffsetY),
                                    Math.abs(this.state.mouseOffsetX - mouseDownX),
                                    Math.abs(this.state.mouseOffsetY - mouseDownY),
                                    this.props.ui.texture, this.props.ui.fill
                                ),
                                transform: 'scale'
                            });
                        }
                        break;
                    case 'PATH':
                        if (!target.dataset.transformable && target.dataset.role !== "SCALE" && target.dataset.role !== "ROTATE" && target.dataset.role !== "EDIT-PATH") {
                            this.setState({
                                segmentStart: 0,
                                preview: methods.path.create(
                                    Math.min(mouseDownX, this.state.mouseOffsetX),
                                    Math.min(mouseDownY, this.state.mouseOffsetY)
                                )
                            });
                        }

                        break;
                    case 'KEY':
                        this.props.addKey(mouseDownX, mouseDownY);
                        break;
                    default:
                        break;
                }
            } else if (this.state.preview !== null) {
                if (this.state.preview.type === 'path') { // add points to path that is not complete
                    if (target.dataset.endpoint) {
                        let closingPath = { ...this.state.preview };
                        this.props.updateObject({ ...this.state.preview, closed: parseInt(target.dataset.index) === 0 });
                        this.setState({
                            preview: null,
                            edit: null,
                            editParam: -1,
                            editIndex: -1
                        });
                    } else {
                        this.setState({
                            segmentStart: this.state.preview.points.length,
                            preview: methods.path.addPoint(
                                this.state.preview,
                                [this.state.mouseOffsetX, this.state.mouseOffsetY],
                                'L'
                            )
                        });
                    }

                }
            }
        } catch (error) {
            console.error(error);
            this.props.throwError(error);
        }
    };

    mouseUpHandler = event => {
        try {
            let target = event.nativeEvent.target;
            this.setState({
                mouseIsDown: false,
                dragging: false,
                panning: false,
                panningRefX: 0,
                panningRefY: 0,
                transform: null,
                lastMouseUpX: this.state.mouseOffsetX,
                lastMouseUpY: this.state.mouseOffsetY,
                t_lastMouseUpX: this.currentX(this.state.mouseOffsetX),
                t_lastMouseUpY: this.currentY(this.state.mouseOffsetY)
            });
            this.props.isDragging(false); // give info to editor component

            const actuallyMoved = Math.abs(this.state.mouseDownX - this.state.mouseOffsetX) > TOOL_SENSIBILITY ||
                Math.abs(this.state.mouseDownY - this.state.mouseOffsetY) > TOOL_SENSIBILITY;

            if (this.state.preview !== null) { // set preview in stone (=store)
                if (this.props.ui.tool === 'PATH') {
                    console.log("editing path");
                    if (this.state.transform !== null) {
                        console.log("  persist state");
                        this.props.updateObject(this.state.preview);
                        this.setState({
                            preview: null
                        });
                    } else {
                        // creating freeform path segment
                        const path = methods.path.smoothSegment(this.state.preview, this.state.segmentStart, this.state.preview.points.length - 1, 10);
                        this.props.setPreview(path);
                        this.state.edit === null && this.setState({ preview: path });
                    }
                } else {
                    // when dragged, create new object
                    if (this.state.dragging && actuallyMoved) this.props.updateObject(this.state.preview);
                    this.setState({
                        preview: null
                    });
                }

                // editing paths
                if (this.state.edit !== null) {
                    if (parseInt(target.dataset.index) === this.state.editIndex && target.dataset.endpoint === 'true' && !actuallyMoved) {
                        const index = parseInt(target.dataset.index);
                        let preview = index === 0 ? methods.path.reverse(cloneDeep(this.state.preview)) : cloneDeep(this.state.preview)
                        this.setState({
                            preview: {
                                ...preview,
                                editMode: true
                            },
                            editIndex: index === 0 ? this.state.preview.points.length - 1 : index,
                            editParam: -1,
                            edit: null,
                        });
                        
                    } else {
                        this.setState({
                            preview: null,
                            edit: null,
                            editParam: -1,
                            // editIndex: -1
                        });
                        this.props.updateObject(this.state.preview);
                    }
                }
            } else {
                if (this.state.transform === null) {
                    switch (this.props.ui.tool) {
                        case "RECT":
                            break;
                        case 'LABEL':
                            if (!this.state.dragging) break;
                            let label = methods.label.create(
                                Math.min(this.state.mouseDownX, this.state.mouseOffsetX),
                                Math.min(this.state.mouseDownY, this.state.mouseOffsetY),
                                Math.abs(this.state.mouseOffsetX - this.state.mouseDownX),
                                Math.abs(this.state.mouseOffsetY - this.state.mouseDownY)
                            );

                            this.props.updateObject(label);
                            setTimeout(() => {
                                document.getElementById("editable_" + label.uuid) && document.getElementById("editable_" + label.uuid).focus();
                            }, 200);
                            break;
                    }
                }
            }
        } catch (error) {
            console.error(error);
            this.props.throwError(error);
        }

    };

    mouseMoveHandler = event => {
        try {
            let transformedCoords = transformCoords(event.clientX, event.clientY);
            // let transformedCoords = transformCoords(event.clientX, event.clientY);
            // TODO hier das snapping implementieren
            const mouseOffsetX = parseInt(transformedCoords.x);
            const mouseOffsetY = parseInt(transformedCoords.y);

            this.setState({
                mouseOffsetX, mouseOffsetY,
                t_mouseOffsetX: this.currentX(event.clientX),
                t_mouseOffsetY: this.currentY(event.clientY),
            });

            if (!this.state.dragging && this.state.mouseIsDown) {
                this.setState({
                    dragging: true
                });
                this.props.isDragging(true); // give info to editor component
            }

            if (this.state.panning) {
                this.props.wrapperRef.current.scrollLeft = this.state.panningRefX - event.pageX;
                this.props.wrapperRef.current.scrollTop = this.state.panningRefY - event.pageY;

                // this.props.changeViewport(
                //     this.props.ui.scalingFactor,
                //     this.props.ui.viewPortX - (this.state.t_mouseOffsetX - this.currentX(event.clientX)),
                //     this.props.ui.viewPortY - (this.state.t_mouseOffsetY - this.currentY(event.clientY))
                // )
            }

            let preview = this.state.preview;
            // set preview
            if (this.state.dragging &&
                this.state.transform !== null &&
                preview === null) {
                this.setState({
                    preview: {
                        ...findObject(
                            this.props.file.present.pages[this.props.ui.currentPage].objects,
                            this.props.ui.selectedObjects[0])
                    }
                });
            } else if (
                preview !== null &&
                this.state.dragging &&
                this.state.transform !== null &&
                this.state.edit === null) {
                // update previews of objects
                this.setState({
                    preview: methods[preview.type][this.state.transform](
                        { ...preview },
                        mouseOffsetX - this.state.mouseOffsetX,
                        mouseOffsetY - this.state.mouseOffsetY,
                        this.state.mouseDownX, this.state.mouseDownY,
                        mouseOffsetX, mouseOffsetY
                    )
                });
            }

            // update preview of line drawing
            if (preview !== null && preview.type === 'path' && this.state.dragging && this.state.edit !== null) {
                // TODO rotierte Pfade bearbeiten
                // const [offsetX, offsetY] = methods.path.getOffset(preview);
                // const [mx, my] = rotatePoint([mouseOffsetX - offsetX, mouseOffsetY - offsetY], -preview.angle);
                this.setState({
                    preview: methods.path.changePoint(
                        cloneDeep(preview),
                        [mouseOffsetX - preview.x, mouseOffsetY - preview.y],
                        // [mx + offsetX, my + offsetY],
                        this.state.editIndex,
                        this.state.editParam
                    )
                });
            }

            // freeform drawing
            if (this.state.preview !== null &&
                this.state.dragging &&
                this.state.transform === null &&
                this.state.edit === null &&
                this.props.ui.tool === 'PATH') {
                preview = methods.path.addPoint(
                    preview,
                    [mouseOffsetX, mouseOffsetY],
                    'LF');

                this.setState({ preview });
            }

        } catch (error) {
            this.props.throwError(error);
        }
    };

    render() {
        const visibleObjects = this.props.file.present.pages[this.props.ui.currentPage].objects;
        let selectedObject = !!visibleObjects ? findObject(
            visibleObjects,
            this.props.ui.selectedObjects[0]) : undefined;
        return (
            <SVG
                xmlns={"http://www.w3.org/2000/svg"}
                version={"1.2"}
                data-role={"CANVAS"}
                id={"MAIN-CANVAS"}
                canvasWidth={this.state.canvasWidth}
                canvasHeight={this.state.canvasHeight}
                className={"tool-" + this.props.ui.tool}
                onMouseDown={this.mouseDownHandler}
                onKeyDown={this.keyDownHandler}
                onKeyUp={this.keyUpHandler}
                onMouseUp={this.mouseUpHandler}
                isPanning={this.state.panning}
                tool={this.props.ui.tool}
                scale={this.props.ui.scalingFactor}
                onMouseMove={this.mouseMoveHandler}
                // onMouseLeave={this.mouseUpHandler}
                onWheel={this.wheelHandler}
                onInput={this.keyDownHandler}
                ref={this.svgElement}
                tabIndex={0}>

                <g id={"VIEWBOX"} transform={`
                       translate(${this.props.ui.viewPortX} ${this.props.ui.viewPortY}) 
                       scale(${this.props.ui.scalingFactor})`}>

                    {/*<rect*/}
                    {/*    fill={"transparent"}*/}
                    {/*    stroke={"white"}*/}
                    {/*    x={this.props.bounds.minH}*/}
                    {/*    y={this.props.bounds.minV}*/}
                    {/*    width={this.props.bounds.maxH - this.props.bounds.minH}*/}
                    {/*    height={this.props.bounds.maxV - this.props.bounds.minV} />*/}


                    {this.props.file.present.pages.map((page, index) => {
                        if (index === this.props.ui.currentPage) return null;
                        return (
                            <SVGPage page={index} key={index} excludes={[]} />
                        )
                    })}

                    <SVGPage page={this.props.ui.currentPage}
                        excludes={this.state.preview ? [this.state.preview.uuid] : []} />

                    {this.state.preview !== null &&
                        mapObject(this.state.preview, -1)
                    }

                    {/* Path indicator */}
                    {this.props.ui.tool === 'PATH' && this.state.preview !== null && this.state.preview.type === 'path' && !this.state.dragging &&
                        <path stroke={"black"} strokeWidth={1}
                            d={`M ${this.state.lastMouseUpX} ${this.state.lastMouseUpY} L ${this.state.mouseOffsetX} ${this.state.mouseOffsetY}`} />
                    }
                </g>

                <Manipulator
                    onModeChange={this.onModeChange}
                    selected={this.state.preview === null ? selectedObject : this.state.preview}
                />

                {/*{this.state.preview !== null && this.state.preview.type === 'path' &&*/}
                <PathManipulator
                    path={this.state.preview || selectedObject}
                    offsetX={this.props.ui.viewPortX}
                    offsetY={this.props.ui.viewPortY}
                    scale={this.props.ui.scalingFactor}
                    editIndex={this.state.editIndex}
                    dragging={this.state.dragging}
                />
                {/*}*/}

                {this.state.dragging && this.state.transform === null && this.state.edit === null &&
                    ((this.props.ui.tool === 'SELECT' || this.props.ui.tool === 'LABEL') && !this.state.panning) &&
                    <g>
                        <rect
                            x={Math.min(this.state.t_mouseDownX, this.state.t_mouseOffsetX)}
                            y={Math.min(this.state.t_mouseDownY, this.state.t_mouseOffsetY)}
                            fill={'rgba(0,0,255,0.02)'}
                            id={"SELECTION-BOX"}
                            stroke={'rgba(0,50,255,0.3)'}
                            strokeWidth={'1px'}
                            width={Math.abs(this.state.t_mouseOffsetX - this.state.t_mouseDownX)}
                            height={Math.abs(this.state.t_mouseOffsetY - this.state.t_mouseDownY)} />
                    </g>
                }

                {this.svgElement.current !== null &&
                    <SVGGrid canvasWidth={this.svgElement.current.scrollWidth}
                        canvasHeight={this.svgElement.current.scrollHeight}
                        offsetX={this.props.ui.viewPortX % (this.props.file.present.verticalGridSpacing * this.props.ui.scalingFactor)}
                        offsetY={this.props.ui.viewPortY % (this.props.file.present.horizontalGridSpacing * this.props.ui.scalingFactor)}
                        verticalGridSpacing={this.props.file.present.verticalGridSpacing * this.props.ui.scalingFactor}
                        horizontalGridSpacing={this.props.file.present.horizontalGridSpacing * this.props.ui.scalingFactor} />
                }

                {/*<rect id={"REFERENCE"} width={1} height={1} x={-1} y={-1} />*/}

                {/*<g id={"mouse-indicators"}>*/}
                {/*    {this.props.ui.scalingFactor !== 1 &&*/}
                {/*<text fill={'green'} fontSize={10} x={5} y={30}>*/}
                {/*    {this.props.ui.viewPortX}, {this.props.ui.viewPortY}&emsp;*/}
                {/*    [{this.props.ui.scalingFactor}]*/}
                {/*</text>*/}
                {/*    <g>*/}
                {/*        <line x1={this.state.mouseOffsetX}*/}
                {/*              y1={0} x2={this.state.mouseOffsetX}*/}
                {/*              y2={this.state.mouseOffsetY - 2} stroke={'grey'} strokeWidth={0.5}/>*/}
                {/*        <text fontSize={8} x={this.state.mouseOffsetX + 2} y={this.state.mouseOffsetY - 8}>*/}
                {/*            {parseInt(this.state.mouseOffsetX)} document space*/}
                {/*        </text>*/}

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
                {/*    <text fill={'green'} fontSize={8} x={this.state.t_mouseOffsetX + 2}*/}
                {/*          y={this.state.t_mouseOffsetY - 8}>*/}
                {/*        {parseInt(this.state.t_mouseOffsetX)} user space*/}
                {/*    </text>*/}

                {/*    <line x1={0}*/}
                {/*          y1={this.state.t_mouseOffsetY} x2={this.state.t_mouseOffsetX - 2}*/}
                {/*          y2={this.state.t_mouseOffsetY} stroke={'lightgreen'} strokeWidth={0.5}/>*/}
                {/*    <text fill={'green'} fontSize={8} y={this.state.t_mouseOffsetY + 10}*/}
                {/*          x={this.state.t_mouseOffsetX - 20}>*/}
                {/*        {parseInt(this.state.t_mouseOffsetY)}</text>*/}
                {/*</g>*/}
                <ToolIndicator hide={this.state.dragging} tool={this.props.ui.tool} coords={[this.state.t_mouseOffsetX, this.state.t_mouseOffsetY]} />
            </SVG>
            // </div>
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
        setPreview: preview => {
            dispatch({
                type: 'SET_PREVIEW',
                preview
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
        updateObject: preview => {
            dispatch({
                type: 'OBJECT_UPDATED',
                preview
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
            if (uuids.length === 0) return;
            dispatch({
                type: 'OBJECT_SELECTED',
                uuids: [null]
            });
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
        addKey: (x, y) => {
            dispatch({
                type: 'OBJECT_UPDATED',
                preview: methods.key.create(x, y)
            });
        },
        throwError: error => {
            dispatch({
                type: ERROR_THROWN, error
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveSVG);