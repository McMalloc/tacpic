import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./gui/Button";
import { USER, RESET_USER_ERRORS } from "../actions/action_constants";
import { useTranslation, Trans } from "react-i18next";
import { Icon } from "./gui/_Icon";
import { Textinput } from "./gui/Input";
import { NavLink } from "react-router-dom";
import { Alert } from "./gui/Alert";
import ServerError from "./platform/ServerError";
import { Checkbox } from "./gui/Checkbox";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3 ";

const SignupForm = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    // input states
    const [uname, setUname] = useState('');
    const [displayname, setDisplayname] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [displaynameValid, setDisplaynameValid] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [newsletterActive, setNewsletterActive] = useState(false);
    const [tryAgain, setTryAgain] = useState('');

    useEffect(() => {
        return () => dispatch({ type: RESET_USER_ERRORS })
    }, []);

    return (
        <>
            <div className={"row"}>
                {user.verification_state === 1 ?
                    <div className={layout}>
                        <h1>{t("account:signup")}</h1>
                        <p><Trans i18nKey={'account:mailSent'}>
                            0<strong>1</strong>2
                        </Trans></p>
                        <p className={"align-center"}>
                            <Icon icon={'envelope fa-3x'} />
                        </p>
                    </div>
                    :
                    <div className={layout}>
                        <h1>{t("account:signup")}</h1>
                        <p>{t("claimUSP")}</p>
                        {/*<hr/>*/}
                        <Alert info>
                            <Trans i18nKey={'account:signupRestrictedInfo'}>
                                0<strong>1</strong>2
                            </Trans>
                        </Alert>
                        <br />
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            setTryAgain(uname + displayname);
                            emailValid && dispatch({
                                type: USER.CREATE.REQUEST,
                                payload: { uname, displayname, newsletterActive }
                            });
                        }}>
                            <Textinput
                                value={uname}
                                label={t("account:email")}
                                sublabel={"account:email-hint"}
                                required
                                autocomplete={"username"}
                                validations={[
                                    {
                                        fn: val => emailRegex.test(val),
                                        message: "account:email-invalid",
                                        callback: setEmailValid
                                    }
                                ]}
                                onChange={event => setUname(event.target.value)}
                                name={'uname'} />
                            <Textinput
                                value={displayname}
                                label={t("account:display_name")}
                                sublabel={"account:display_name-hint"}
                                onChange={event => setDisplayname(event.target.value)}
                                name={'uname'} />

                            {tryAgain === uname + displayname && <ServerError error={user.error} />}


                            <p>{t("account:passwordNextStep")}</p>

                            {/* TODO Rechtlich abklären */}
                            {/* <Checkbox onChange={event => setNewsletterActive(!newsletterActive)}
                                name={'cb-newsletter-active'}
                                checked={newsletterActive}
                                label={"account:newsletter-active"} /> */}

                            <Checkbox onChange={event => setPrivacyAccepted(!privacyAccepted)}
                                name={'cb-privacy-accept'}
                                checked={privacyAccepted}
                                label={"account:accept-privacy-policy"} />
                            <NavLink target={"_blank"}
                                to={"/info/de/65?Datenschutzerkl%C3%A4rung"} className={"checkbox-additional"}>
                                {t("account:viewPrivacyPolicy")}
                            </NavLink><br /><br />

                            <div style={{ textAlign: "center" }}>
                                <Button disabled={!(emailValid) || user.verification_state === 0 || !privacyAccepted}
                                    primary
                                    icon={user.verification_state === 0 ? "cog fa-spin" : "user-plus"}
                                    // onClick={() => trackEvent({category: 'signup', action: 'submit'})}
                                    type={'submit'}>{t("account:signup")}</Button>
                            </div>
                            <p>
                                <Trans i18nKey={'account:alreadySignedUp'}>
                                    0<NavLink to={"/login"}>1</NavLink>
                                </Trans>

                            </p>
                        </form>
                    </div>
                }

            </div>
        </>
    );
};

export default SignupForm;