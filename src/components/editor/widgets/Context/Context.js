import React, {Component} from 'react';
import {connect} from "react-redux";
import ShapeContext from "./ShapeContext";

class Context extends Component {

    render() {
        return (
            <ShapeContext>

            </ShapeContext>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Context);