import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";

class LabelContext extends Component {

    render() {
        return (
            <Fragment>
                <label>
                    <input checked onChange={() => {}} type={'checkbox'} /> Punktschrift
                    <input checked onChange={() => {}} type={'checkbox'} /> Schwarzschrift
                </label>
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

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelContext);