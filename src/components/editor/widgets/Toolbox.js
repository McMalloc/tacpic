import React, {Component, Fragment} from 'react'
import { connect } from 'react-redux'
import { switchCursorMode } from '../../../actions/index'

class Toolbox extends Component {
    // constructor(props, context) {
    //     super(props, context);
    // }

    render() {
        return (
            <Fragment>
                <span>{this.props.mode}</span>
                <button onClick={() => { this.props.switchCursorMode("rect"); }}>Rechteck</button>
                <button onClick={() => { this.props.switchCursorMode("circle"); }}>Kreis</button>
                <button onClick={() => { this.props.undo(); /*this.props.triggerRedraw();*/}}>Undo</button>
                <button onClick={() => { this.props.redo(); /*this.props.triggerRedraw();*/}}>Redo</button>
                <button onClick={() => { this.props.switchCursorMode("label"); /*this.props.triggerRedraw();*/}}>Label</button>
            </Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        mode: state.editor.present.mode
    }
};

const mapDispatchToProps = dispatch => {
    return {
        switchCursorMode: mode => {
            dispatch(switchCursorMode(mode));
        },
        undo: () => {
            dispatch({type: 'UNDO'});
        },
        redo: () => {
            dispatch({type: 'REDO'});
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox)