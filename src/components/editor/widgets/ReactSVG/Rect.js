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

        console.log("rerender rect ", this.props.pattern.template);
        return (
            <g>
                <rect
                    id={this.props.uuid}
                    transform={transform(this.props.x, this.props.y, this.props.angle)}
                    // style={{fill: selected ? 'rgba(50,200,0,0.4)' : 'rgba(0,0,0,0.4)'}}

                    style={{fill: 'url(#pattern-' + this.props.uuid + ''}}
                    strokeWidth={2}
                    stroke={'rgba(0,50,100,0.2)'}
                    width={this.props.width}
                    height={this.props.height}
                    onMouseDown={ event => {
                        event.stopPropagation();
                    }}
                    onMouseUp={ event => {
                        event.stopPropagation();
                        console.log("select rect");
                        this.props.select(this.props.uuid)
                    }}
                />
                {patternTemplates[this.props.pattern.template](this.props.pattern, this.props.uuid, this.props.fill)}
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
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Rect);