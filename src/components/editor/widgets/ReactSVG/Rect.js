import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import transform from "./Transform";

class Rect extends Component {
    render() {
        let selected = false;
        this.props.selectedObjects.forEach(uuid => {
            if (this.props.uuid === uuid) selected = true
        });

        return (
            <rect
                id={this.props.uuid}
                transform={transform(this.props.x, this.props.y, this.props.angle)}
                style={{fill: selected ? 'rgba(50,200,0,0.4)' : 'rgba(0,0,0,0.4)'}}
                width={this.props.width}
                height={this.props.height}
                onClick={ () => this.props.select(this.props.uuid)}
            />
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