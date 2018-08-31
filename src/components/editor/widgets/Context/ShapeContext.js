import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {createTextureModeAction} from "../../../../actions";

class ShapeContext extends Component {

    render() {
        return (
            <Fragment>
                <button onClick={() => { this.props.switchTextureMode("striped"); }}>gestreift</button>
                <button onClick={() => { this.props.switchTextureMode("dashed"); }}>gestrichelt</button>
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
        switchTextureMode: (mode) => {
            dispatch(createTextureModeAction(mode));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShapeContext);