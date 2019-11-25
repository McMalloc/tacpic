import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import transform from "./Transform";
import {compact} from "lodash";

class Manipulator extends Component {
    mouseDownHandler = event => {
        // event.stopPropagation();
        // TODO wenn ein Label selektiert ist, sollte ein Doppelclick auf den manipulator
        // den focus auf das editierbare Label verschieben (mit $(id).focus(), wenn tabindex gesetzt und der debugger könnte interferieren)
        // Ein Umsetzen des des Cursors würde aber wieder den Manipulator auswählen und die Cursorposition zurücksetzen
    };

    mouseUpHandler = event => {
        // event.stopPropagation();
        // this.props.transformStart('translate');
    };

    mouseMoveHandler = event => {

    };

    render() {
        // bounding Box der ausgewählten Elemente berechnen und Manipulator rendern
        // Manipulator hört auf Events (delegiert vom SVG?) und verändert entsprechend per dispatch die Werte

        return (this.props.selected.length > 0 &&
            <g transform={transform(this.props.bbox.x, this.props.bbox.y, this.props.selected[0].angle)}>
                <rect
                    fill={"none"}
                    stroke={'rgba(0,0,255,0.7)'}
                    strokeWidth={3}
                    strokeDasharray={"5,5"}
                    onMouseDown={this.mouseDownHandler}
                    onMouseUp={this.mouseUpHandler}
                    onMouseMove={this.mouseMoveHandler}
                    width={this.props.bbox.width}
                    height={this.props.bbox.height}
                />
                <rect
                    x={this.props.bbox.width / 2 - 5}
                    style={{cursor: "pointer"}}
                    data-role={"__rotate"}
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
    }
}

const mapStateToProps = state => {
    let selected = compact(state.editor.ui.selectedObjects.map(uuid => {
        return state.editor.file.pages[state.editor.ui.currentPage].objects.find(obj => {
            return obj.uuid === uuid
        })
    }));

    return {
        selected,
        bbox: (() => {
            if (state.editor.ui.selectedObjects.length === 0 || state.editor.ui.selectedObjects[0] === "FG") return 0;
            let element = document.getElementById(state.editor.ui.selectedObjects[0]);
            if (element === null || element === undefined) return {x: 0, y: 0, width: 0, height: 0};
            let svgbbox = element.getBBox();
            // TODO: alle ausgewählten Elemente berücksichtigen und bessere Methode finden als ID-Selektor
            // versuchen, irgendwie den eigentlich DOMNode mit im STate zu speichern, um Zugriff auf Props als auch auf getBBox() zu haben
            return {
                x: svgbbox.x + selected[0].x,
                y: svgbbox.y + selected[0].y,
                width: svgbbox.width,
                height: svgbbox.height
            };
        })()
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