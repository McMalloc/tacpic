import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import transform from "./Transform";
import {compact, reduce} from "lodash";
import transformations, {combineBBoxes} from "./methods";

class Manipulator extends Component {
    constructor(props) {
        super(props);
        this.doubleClickHandler = this.doubleClickHandler.bind(this);
    }

    doubleClickHandler = event => {
        if (this.props.selected.length === 1) {
            let lastSelectedId = this.props.selected[0].uuid;
            setTimeout(() => {
                document.getElementById("editable_" + lastSelectedId).focus();
            }, 0);
            this.props.startEditing(lastSelectedId);
        }
    };

    render() {
        // bounding Box der ausgewählten Elemente berechnen und Manipulator rendern
        // Manipulator hört auf Events (delegiert vom SVG?) und verändert entsprechend per dispatch die Werte
        if (this.props.selected.length > 0) {
            const bbox = combineBBoxes(this.props.selected);
            return (
                <g transform={transform(bbox.x, bbox.y, this.props.selected[0].angle)}>
                    <rect
                        fill={"transparent"}
                        stroke={'rgba(0,0,255,0.7)'}
                        strokeWidth={3}
                        strokeDasharray={"5,5"}
                        onMouseDown={this.mouseDownHandler}
                        data-transformable={1}
                        data-role="MANIPULATOR"
                        onMouseUp={this.mouseUpHandler}
                        onMouseMove={this.mouseMoveHandler}
                        onDoubleClick={this.doubleClickHandler}
                        width={bbox.width}
                        height={bbox.height}
                    />
                    <rect
                        x={bbox.width / 2 - 5}
                        style={{cursor: "pointer"}}
                        data-role={"ROTATE"}
                        onMouseDown={event => {
                            // event.stopPropagation();
                            // this.props.transformStart('rotate')
                        }}
                        y={-10}
                        width={10} height={10}/>

                    <rect
                        x={-5}
                        y={-5}
                        onMouseDown={event => {
                            // event.stopPropagation();
                            // this.props.transformStart('scale')
                        }}
                        width={10} height={10}/>
                </g>

            )
        } else return null;



    }
}

const mapStateToProps = state => {
    let selected = compact(state.editor.ui.selectedObjects.map(uuid => {
        return state.editor.file.pages[state.editor.ui.currentPage].objects.find(obj => {
            return obj.uuid === uuid
        })
    }));

    return { selected }
};

const mapDispatchToProps = dispatch => {
    return {
        transformStart: transform => {
            dispatch({
                type: 'TRANSFORM_START',
                transform
            });
        },
        startEditing: uuid => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                prop: 'editMode',
                value: true,
                uuid
            });

            dispatch({
                type: 'OBJECT_SELECTED',
                uuids: [null]
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Manipulator);