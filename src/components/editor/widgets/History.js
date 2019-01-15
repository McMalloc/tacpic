import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";

class History extends Component {

    render() {
        return (
            <Fragment>
                <button onClick={() => { this.props.undo(); /*this.props.triggerRedraw();*/}}>Undo</button>
                <button onClick={() => { this.props.redo(); /*this.props.triggerRedraw();*/}}>Redo</button>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
};

const mapDispatchToProps = dispatch => {
    return {
        undo: () => {
            dispatch({type: 'UNDO'});
        },
        redo: () => {
            dispatch({type: 'REDO'});
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(History);