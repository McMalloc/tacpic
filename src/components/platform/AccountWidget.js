import React, {Component} from 'react';
import {connect} from "react-redux";
import Login from "../Login";

class AccountWidget extends Component {
    // TODO: Route im Backend, worüber ein Token verifiziert werden kann
    render() {
        return (
            <Login />

            // <div>{this.props.email}</div>
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