import React, {Component, Fragment} from 'react'
import { connect } from 'react-redux'
import { switchCursorMode } from '../../../actions/index'
import {Modal} from "../../gui/Modal";
// import { redrawCanvas } from "./Canvas";

class Toolbox extends Component {
    // constructor(props, context) {
    //     super(props, context);
    // }

    state = {
        showDescriptionModal: false
    };

    render() {
        const imageDescModal = this.state.showDescriptionModal ? (
            <Modal><div>Bildbeschreibung junge!</div><button onClick={() => { this.setState({showDescriptionModal: false}) }}>Schließen</button></Modal>
        ) : null;

        return (
            <Fragment>
                <span>{this.props.mode}</span>
                <button onClick={() => { this.props.switchCursorMode("rect"); }}>Rechteck</button>
                <button onClick={() => { this.props.switchCursorMode("circle"); }}>Kreis</button>
                <button onClick={() => { this.props.switchCursorMode("label"); /*this.props.triggerRedraw();*/}}>Label</button>
                <button onClick={() => { this.props.switchCursorMode("line");}}>Linie</button>
                <button onClick={() => { this.props.switchCursorMode("curve");}}>Kurve</button>
                <button onClick={() => { this.setState({showDescriptionModal: true}) }}>Verbalisierung</button>

                {imageDescModal}
            </Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        mode: state.editor.mode
    }
};

const mapDispatchToProps = dispatch => {
    return {
        switchCursorMode: mode => {
            dispatch(switchCursorMode(mode));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox)