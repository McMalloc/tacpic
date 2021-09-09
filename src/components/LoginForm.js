import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "./gui/Button";
import {RESET_USER_ERRORS, USER} from "../actions/action_constants";
import {useTranslation} from "react-i18next";
import {Textinput} from "./gui/Input";
import {Alert} from "./gui/Alert";
import {Link} from "react-router-dom";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Login = props => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    // reset errors
    useEffect(() => () => dispatch({type: RESET_USER_ERRORS}), []);

    // input states
    const [uname, setUname] = useState('');
    const [pwd, setPwd] = useState('');
    const [tryAgain, setTryAgain] = useState('');

    // input validities
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            setTryAgain(pwd+uname);
            dispatch({
                // emailValid && passwordValid && dispatch({
                type: USER.LOGIN.REQUEST,
                payload: {login: uname, password: pwd}
            });
        }}>
            <Textinput
                value={uname}
                label={t("account:email")}
                autocomplete={"username"}
                validations={[
                    {fn: val => emailRegex.test(val), message: "account:email-invalid", callback: setEmailValid}
                ]}
                onChange={event => setUname(event.target.value)}
                name={'uname'}/>
            <Textinput
                value={pwd}
                label={t("account:password")}
                autocomplete={"password"}
                validations={[
                    {fn: val => val.length >= 8, message: "account:password-invalid", callback: setPasswordValid}
                ]}
                type={"password"}
                onChange={event => setPwd(event.target.value)}
                name={'pwd'}/>

            {!!user.error && (tryAgain === pwd+uname) &&
            <><Alert warning>
                {t("account:" + user.error.error)}:<br/>
                {user.error['field-error'] && t("account:" + user.error['field-error'][1])}
            </Alert><br/></>
            }
            <p className={"align-right"}>
                <Link to={"/reset-password-request"}> {t('account:forgotPassword')}</Link>
            </p>

            <div className={'align-center'}>
                <Button icon={user.login_pending ? "cog fa-spin" : "sign-in-alt"} primary
                        label={"account:login"}
                        disabled={!(emailValid && passwordValid) || user.login_pending}
                        type={'submit'} />
            </div>
        </form>
    );
};

export default Login;