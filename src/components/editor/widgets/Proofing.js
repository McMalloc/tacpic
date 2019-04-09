import React, {Component} from 'react';
import {connect} from "react-redux";

class Navigator extends Component {

    render() {
        return (
            <React.Fragment>
               Überprüfen
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);