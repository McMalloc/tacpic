import React, {Component} from 'react';
import {connect} from "react-redux";
import ShapeContext from "./ShapeContext";
import LabelContext from "./LabelContext";

class Context extends Component {

    render() {
        switch (this.props.mode) {
            case "rect":
                return (
                    <ShapeContext>

                    </ShapeContext>
                );
            case "label":
                return (
                    <LabelContext>

                    </LabelContext>
                );
            default: return (<div></div>);
        }
    }
}

const mapStateToProps = state => {
    return {
        mode: state.editor.mode
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Context);