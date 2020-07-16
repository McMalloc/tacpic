import React, {Component} from 'react';
import {connect} from "react-redux";
import Login from "../Login";

class AccountWidget extends Component {
    render() {
        return (
            <Login />
        );
    }
}

const mapStateToProps = state => {
    return {
        email: state.user.email,
        loggedIn: state.user.logged_in,
        pending: state.user.login_pending
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountWidget);