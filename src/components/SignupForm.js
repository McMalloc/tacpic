import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "./gui/Button";
import {USER, RESET_USER_ERRORS} from "../actions/action_constants";
import {useTranslation} from "react-i18next";
import {Icon} from "./gui/_Icon";
import {Textinput} from "./gui/Input";
import {NavLink, Redirect} from "react-router-dom";
import {Alert} from "./gui/Alert";
import CenterWrapper from "./gui/_CenterWrapper";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 ";

const SignupForm = props => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    // input states
    const [uname, setUname] = useState('');
    const [emailValid, setEmailValid] = useState(false);

    useEffect(() => {
        return () => dispatch({type: RESET_USER_ERRORS})
    }, []);

    // if (user.verification_state === -5) {
    //     return <Redirect push to="/catalogue"/>;
    // }

    return (
            <div className={"row full-height extra-margin"}>
                {user.verification_state === 1 ?
                    <>
                        <div className={layout}>
                            <h1>{t("general:signup")}</h1>
                            <p>Wir haben Ihnen eine <strong>E-Mail zur Bestätigung</strong> geschickt, bitte überprüfen Sie Ihr Postfach.</p>
                            <p className={"align-center"}>
                                <Icon icon={'envelope fa-3x'} />
                            </p>
                        </div>
                    </>
                    :
                    <div className={layout}>
                        <h1>{t("general:signup")}</h1>
                        <p>Taktile Medien &mdash; schnell, gut und einfach</p>
                        <hr/>
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            emailValid && dispatch({
                                type: USER.CREATE.REQUEST,
                                payload: {uname}
                            });
                        }}>
                            <Textinput
                                value={uname}
                                label={t("general:email")}
                                sublabel={"general:email-hint"}
                                autocomplete={"username"}
                                validations={[
                                    {
                                        fn: val => emailRegex.test(val),
                                        message: "general:email-invalid",
                                        callback: setEmailValid
                                    }
                                ]}
                                onChange={event => setUname(event.target.value)}
                                name={'uname'}/>

                            {user.error !== null &&
                            <><Alert warning>
                                {t("auth:" + user.error.error)}<br/>
                                {user.error['field-error'] && t("auth:" + user.error['field-error'][1])}
                            </Alert><br/></>
                            }

                            <p>Für ein Passwort entscheiden Sie sich im nächsten Schritt.</p>

                            {user.verification_state === 0 ?
                                (<Icon icon={"cog fa-spin"}/>) :
                                (<>
                                    <div style={{textAlign: "center"}}>
                                        <Button disabled={!(emailValid)} primary
                                                type={'submit'}>{t("general:signup")}</Button>
                                        <p>
                                            &emsp;Haben Sie bereits ein Konto? <NavLink to={"/login"}>Hier
                                            anmelden.</NavLink>
                                        </p>
                                    </div>
                                </>)
                            }
                        </form>
                    </div>
                }

            </div>
    );
};

export default SignupForm;