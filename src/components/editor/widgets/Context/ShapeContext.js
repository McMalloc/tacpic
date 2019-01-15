import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {createFillModeAction, createTextureModeAction} from "../../../../actions";

class ShapeContext extends Component {

    render() {
        return (
            <Fragment>
                <button onClick={() => { this.props.switchTextureMode("striped"); }}>gestreift</button>
                <button onClick={() => { this.props.switchTextureMode("dashed"); }}>gestrichelt</button>

                <button onClick={() => { this.props.switchFillMode("rgba(255,0,0,0.4)"); }}>rot</button>
                <button onClick={() => { this.props.switchFillMode("rgba(0,255,0,0.4)"); }}>grün</button>
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
        },
        switchFillMode: (fill) => {
            dispatch(createFillModeAction(fill));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShapeContext);