import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import transform from "./Transform";
import patternTemplates from "./Patterns";

class Rect extends Component {
    render() {
        let selected = false;
        this.props.selectedObjects.forEach(uuid => {
            if (this.props.uuid === uuid) selected = true
        });

        // TODO: wenn Farbe mit Textur geändert wird, aktualisiert sich das Objekt trotz anderem Pattern nicht. Irgendwas muss sich daher auch im style-String ändern
        const template = this.props.pattern.template;
        return (
            <g>
                <rect
                    id={this.props.uuid}
                    transform={transform(this.props.x, this.props.y, this.props.angle)}
                    style={{fill: template !== null ? 'url(#pattern-' + template + '-' + this.props.uuid + '' : this.props.fill || "transparent"}}
                    strokeWidth={2}
                    stroke={'rgba(0,50,100,0.2)'}
                    width={this.props.width}
                    height={this.props.height}
                    onMouseUp={ event => {
                        // event.stopPropagation();
                    }}
                    onMouseDown={ event => {
                        // console.log("rect mouse down");
                        // event.stopPropagation();
                        // selected ? this.props.transformStart('translate') : this.props.select(this.props.uuid);
                    }}
                />
                {template !== null && patternTemplates[template](this.props.pattern, this.props.uuid, this.props.fill)}
            </g>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedObjects: state.editor.selectedObjects
    }
};

const mapDispatchToProps = dispatch => {
    return {
        select: (uuid) => {
            dispatch({
                type: 'OBJECT_SELECTED',
                uuid
            });
        },
        transformStart: transform => {
            dispatch({
                type: 'TRANSFORM_START',
                transform
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Rect);