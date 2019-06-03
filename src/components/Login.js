import React, {Component} from 'react';
import {connect} from "react-redux";
import {createApiAction} from "../actions/api_actions";
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
            },
            showModalA: false,
            showModalB: false
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
                this.props.submitUserLogin(this.state)
            }}>
                <label>Nutzername</label>
                <input value={this.state.unameField.value} onChange={this.handleChange} name={'uname'}/>
                <label>Passwort</label>
                <input value={this.state.pwdField.value} onChange={this.handleChange} type={'password'} name={'pwd'}/>
                {this.props.login_pending ? (<span>Warte kurz, Brudi</span>) : (<button type={'submit'}>Anmelden</button>)}
            </form>;

        return (
            <React.Fragment>
                {this.props.logged_in ? (
                    <span>Angemeldet!</span>
                ) : (form)}
                <p>
                    <Button onClick={() => this.setState({showModalA: true})}>Öffne Modal A</Button>
                    {this.state.showModalA &&
                        <Modal title={"Modalfenster"} dismiss={() => {this.setState({showModalA: false})}} actions={[
                            {label: "OK", action: () => {this.setState({showModalA: false})}}
                        ]}>Hi</Modal>
                    }
                    <Button onClick={() => this.setState({showModalB: true})}>Öffne Modal B</Button>
                    {this.state.showModalB &&
                        <Modal title={"Modalfenster"} dismiss={() => {this.setState({showModalB: false})}} actions={[
                            {label: "OK", action: () => {this.setState({showModalB: false})}}
                        ]}>Hi</Modal>
                    }
                </p>
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
        submitUserLogin: (state) => {
            return dispatch(createApiAction(USER.LOGIN.REQUEST, state));
        }
    }
};

// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Login);