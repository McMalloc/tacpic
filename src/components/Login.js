import React, {Component} from 'react';
import {connect} from "react-redux";
import {createApiAction} from "../actions/api_actions";
import {USER} from "../actions/constants";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unameField: {
                value: ''
            },
            pwdField: {
                value: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        switch (event.target.name) {
            case 'uname':
                this.setState({
                    unameField: {
                        value: event.target.value
                    }
                });
                break;
            case 'pwd':
                this.setState({
                    pwdField: {
                        value: event.target.value
                    }
                });
                break;
            default: break;
        }
    }

    render() {
        return (
            <form onSubmit={(event) => {event.preventDefault(); this.props.submitUserLogin(this.state)}}>
                <label>Nutzername</label>
                <input value={this.state.unameField.value} onChange={this.handleChange} name={'uname'}/>
                <label>Passwort</label>
                <input value={this.state.pwdField.value} onChange={this.handleChange} type={'password'} name={'pwd'}/>
                <button type={'submit'}>Anmelden</button>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = dispatch => {
    return {
        submitUserLogin: (state) => {
            return dispatch(createApiAction(USER.LOGIN.REQUEST, state));
        }
    }
};

// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Login);