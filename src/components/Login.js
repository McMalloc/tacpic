import React, {Component} from 'react';
import {connect} from "react-redux";
import {USER} from "../actions/constants";
import {Button} from "./gui/Button";
import {Modal} from "./gui/Modal";

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
    }

    componentDidMount() {
        this.props.validateLogin();
    }

    handleChange = (event) => {
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
    };

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
                    (<span className={"fas fa-cog fa-spin"} />) :
                    (<button type={'submit'}>Anmelden</button>)
                }
            </form>;

        return (
            <React.Fragment>
                {this.props.logged_in ? (
                    <span>Angemeldet als {this.props.displayName}</span>
                ) : (form)}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state.user
    }
};

const mapDispatchToProps = dispatch => {
    return {
        submitUserLogin: (username, password) => {
            return dispatch({
                type: USER.LOGIN.REQUEST,
                username, password
            });
        },
        validateLogin: () => {
            return dispatch({
                type: USER.VALIDATE.REQUEST
            });
        }
    }
};

// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Login);