import React, {Component} from 'react';
import {connect} from "react-redux";
import {USER} from "../actions/constants";
import {Button} from "./gui/Button";
import {Modal} from "./gui/Modal";

class Register extends Component {
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
        let form =
            <form onSubmit={(event) => {
                event.preventDefault();
                this.props.submitUserLogin(this.state.unameField.value, this.state.pwdField.value)
            }}>
                <label>Nutzername</label>
                <input value={this.state.unameField.value} onChange={this.handleChange} name={'uname'}/>
                <label>Passwort</label>
                <input value={this.state.pwdField.value} onChange={this.handleChange} type={'password'} name={'pwd'}/>
                {this.props.login_pending ?
                    (<span>Warte kurz, Brudi</span>) :
                    (<button type={'submit'}>Registrieren</button>)
                }
            </form>;

        return (
            <React.Fragment>
                {this.props.logged_in ? (
                    <span>Angemeldet!</span>
                ) : (form)}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state.user.user
    }
};

const mapDispatchToProps = dispatch => {
    return {
        submitUserLogin: (username, password) => {
            return dispatch({
                type: USER.CREATE.REQUEST,
                username, password
            });
        }
    }
};

// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Register);