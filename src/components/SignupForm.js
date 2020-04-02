import React, {useState} from "react";
import {useHistory, useParams, useRouteMatch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "./gui/Button";
import {VARIANT, FILE, USER} from "../actions/constants";
import {Row} from "./gui/Grid";
import styled, {useTheme} from "styled-components";
import {useTranslation} from "react-i18next";
import {Icon} from "./gui/_Icon";
import {TagView} from "./platform/Tag";
import {Textinput} from "./gui/Input";
import {NavLink, Redirect} from "react-router-dom";
import {Alert} from "./gui/Alert";
import {Form} from "./gui/Form";

const GraphicView = styled.div`

`;

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4";

const SignupForm = props => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    // input states
    const [uname, setUname] = useState("");
    const [pwd, setPwd] = useState("");
    const [pwdConfirm, setPwdConfirm] = useState("");

    // input validities
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);

    if (user.logged_in) {
        return <Redirect push to="/catalogue"/>;
    }

    return (
        <div className={"container"}>
            <div className={"row extra-margin"}>
                <h1 className={layout}>{t("general:signup")}</h1>
            </div>

            <div className={"row"}>
                <form className={layout} onSubmit={(event) => {
                    event.preventDefault();
                    emailValid && passwordValid && passwordConfirmed && dispatch({
                        type: USER.CREATE.REQUEST,
                        payload: {uname, pwd, pwdConfirm}
                    });
                }}>
                    <Textinput
                        value={uname}
                        label={t("general:email")}
                        sublabel={"general:email-hint"}
                        autocomplete={"username"}
                        validations={[
                            {fn: val => emailRegex.test(val), message: "general:email-invalid", callback: setEmailValid}
                        ]}
                        onChange={event => setUname(event.target.value)}
                        name={'uname'}/>
                    <Textinput
                        value={pwd}
                        label={t("general:password")}
                        autocomplete={"new-password"}
                        sublabel={"general:password-hint"}
                        validations={[
                            {
                                fn: val => val.length >= 8,
                                message: "general:password-invalid",
                                callback: setPasswordValid
                            }
                        ]}
                        type={"password"}
                        onChange={event => setPwd(event.target.value)}
                        name={'pwd'}/>
                    <Textinput
                        value={pwdConfirm}
                        autocomplete={"new-password"}
                        label={t("general:password-confirm")}
                        type={"password"}
                        validations={[
                            {
                                fn: val => val === pwd,
                                message: "general:password-confirm-invalid",
                                callback: setPasswordConfirmed
                            }
                        ]}
                        onChange={event => setPwdConfirm(event.target.value)}
                        name={'pwdConfirm'}/>

                    {/*{user.error !== null &&*/}
                    {/*    <><Alert warning>{t("auth:" + user.error["field-error"][1])}</Alert><br/></>*/}
                    {/*}*/}

                    {user.login_pending ?
                        (<Icon icon={"cog fa-spin"}/>) :
                        (<>
                            <div style={{textAlign: "center"}}>
                                <Button disabled={!(emailValid && passwordValid && passwordConfirmed)} primary
                                        type={'submit'}>{t("general:signup")}</Button>
                                <p>
                                    &emsp;Haben Sie bereits ein Konto? <NavLink to={"/login"}>Hier anmelden.</NavLink>
                                </p>
                            </div>
                        </>)
                    }
                </form>
            </div>
        </div>

    );
};

export default SignupForm;