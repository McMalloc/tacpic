import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "./gui/Button";
import {USER} from "../actions/action_constants";
import {useTranslation} from "react-i18next";
import {Icon} from "./gui/_Icon";
import {Textinput} from "./gui/Input";
import {Alert} from "./gui/Alert";
import {Link} from "react-router-dom";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Login = props => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    // input states
    const [uname, setUname] = useState('');
    const [pwd, setPwd] = useState('');

    // input validities
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            dispatch({
                // emailValid && passwordValid && dispatch({
                type: USER.LOGIN.REQUEST,
                payload: {login: uname, password: pwd}
            });
        }}>
            <Textinput
                value={uname}
                label={t("general:email")}
                autocomplete={"username"}
                validations={[
                    {fn: val => emailRegex.test(val), message: "general:email-invalid", callback: setEmailValid}
                ]}
                onChange={event => setUname(event.target.value)}
                name={'uname'}/>
            <Textinput
                value={pwd}
                label={t("general:password")}
                autocomplete={"password"}
                validations={[
                    {fn: val => val.length >= 8, message: "general:password-invalid", callback: setPasswordValid}
                ]}
                type={"password"}
                onChange={event => setPwd(event.target.value)}
                name={'pwd'}/>

            {user.error !== null &&
            <><Alert warning>
                {t("auth:" + user.error.error)}<br/>
                {user.error['field-error'] && t("auth:" + user.error['field-error'][1])}
            </Alert><br/></>
            }
            <p className={"align-right"}>
                <Link to={"/reset-password-request"}>Passwort vergessen?</Link>
            </p>

            <div className={'align-center'}>
                <Button icon={user.login_pending ? "cog fa-spin" : "sign-in-alt"} primary
                        disabled={!(emailValid && passwordValid) || user.login_pending}
                        type={'submit'}>{t("general:login")}</Button>
            </div>
        </form>
    );
};

export default Login;