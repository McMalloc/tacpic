import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";

class Manipulator extends Component {
    mouseDownHandler(event) {
        this.props.transformStart('transform');
    }

    render() {
        // bounding Box der ausgewählten Elemente berechnen und Manipulator rendern
        // Manipulator hört auf Events (delegiert vom SVG?) und verändert entsprechend per dispatch die Werte

        return ( this.props.selected.length > 0 &&
            <g>
                <rect
                    fill={"transparent"}
                    stroke={'blue'}
                    strokeWidth={2}
                    strokeDasharray={[5,5]}
                    width={this.props.bbox.width}
                    height={this.props.bbox.height}
                    transform={`translate(${this.props.bbox.x}, ${this.props.bbox.y})`}/>
                <rect
                    x={this.props.bbox.x + this.props.bbox.width/2 - 5}
                    onMouseDown={ event => {this.mouseDownHandler(event)}}
                    y={this.props.bbox.y - 10}
                    width={10} height={10} />
            </g>

        )
    }
}

const mapStateToProps = state => {
    let selected = state.editor.selectedObjects.map(uuid => {
        return state.editor.objects.filter(obj => {return obj.uuid === uuid})[0]
    });

    return {
        selected,
        bbox: (() => {
            if (state.editor.selectedObjects.length === 0) return 0;
            let svgbbox = document.getElementById(state.editor.selectedObjects[0]).getBBox();
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
        // rotate: angle => {
        //     dispatch({
        //         type: 'OBJECT_ROTATED',
        //         angle
        //     });
        // },
        transformStart: transform => {
            dispatch({
                type: 'TRANSFORM_START',
                transform
            })
        },
        // transformEnd: () => {
        //     console.log('end');
        //     dispatch({
        //         type: 'TRANSFORM_END'
        //     })
        // }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Manipulator);