import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import transform from "./Transform";
import {compact, reduce} from "lodash";
import transformations, {combineBBoxes} from "./methods";

class Manipulator extends Component {
    mouseDownHandler = event => {
        // event.stopPropagation();
        // TODO wenn ein Label selektiert ist, sollte ein Doppelclick auf den manipulator
        // den focus auf das editierbare Label verschieben (mit $(id).focus(), wenn tabindex gesetzt und der debugger könnte interferieren)
        // Ein Umsetzen des des Cursors würde aber wieder den Manipulator auswählen und die Cursorposition zurücksetzen
    };

    mouseUpHandler = event => {};

    mouseMoveHandler = event => {};

    render() {
        // bounding Box der ausgewählten Elemente berechnen und Manipulator rendern
        // Manipulator hört auf Events (delegiert vom SVG?) und verändert entsprechend per dispatch die Werte

        if (this.props.selected.length > 0) {

            const bbox = combineBBoxes(this.props.selected);

            // fill={"transparent"} bewirkt, dass translate nicht ausgeführt wird, sollte es aber trotzdem
            return (
                <g transform={transform(bbox.x, bbox.y, this.props.selected[0].angle)}>
                    <rect
                        fill={"transparent"}
                        stroke={'rgba(0,0,255,0.7)'}
                        strokeWidth={3}
                        strokeDasharray={"5,5"}
                        onMouseDown={this.mouseDownHandler}
                        data-transformable={1}
                        onMouseUp={this.mouseUpHandler}
                        onMouseMove={this.mouseMoveHandler}
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

    return {
        selected
    }
};

const mapDispatchToProps = dispatch => {
    return {
        transformStart: transform => {
            dispatch({
                type: 'TRANSFORM_START',
                transform
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Manipulator);