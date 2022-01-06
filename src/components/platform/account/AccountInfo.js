import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import Well from "../../gui/Well";
import { Button } from "../../gui/Button";
import { Textinput } from "../../gui/Input";
import { Alert } from "../../gui/Alert";
import ServerError from "../ServerError";
import Modal from "../../gui/Modal";
import * as moment from "moment";
import { DB_DATE_FORMAT } from "../../../config/constants";
import { USER, RESET_USER_ERRORS } from "../../../actions/action_constants";
import { Secret } from "../../gui/Secret";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AccountInfo = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const { t } = useTranslation();
    const [modalContent, setModalContent] = useState(null);

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [pwdRepeated, setPwdRepeated] = useState("");
    const [newPwd, setNewPwd] = useState("");

    const [nameValid, setNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [newPwdValid, setNewPwdValid] = useState(false);
    const [pwdRepeatedValid, setPwdRepeatedValid] = useState(false);

    useEffect(() => () => dispatch({ type: RESET_USER_ERRORS }), []);

    const forms = {
        display_name: {
            component: <>{!!user.message ? <Alert success>{t("account:" + user.message)}</Alert>
                : <form id={"changeName"} onSubmit={event => { event.preventDefault(); forms.changeName.action() }}>
                    <p>{t("account:current")}: {user.displayName}</p>
                    <Textinput
                        onChange={event => setDisplayName(event.target.value)}
                        validations={[
                            { fn: val => val.length >= 3, message: "account:name-invalid", callback: setNameValid }
                        ]}
                        value={displayName}
                        name={"displayName"}
                        label={"account:newName"}>
                    </Textinput>
                </form>}</>,
            action: () => {
                dispatch({
                    type: USER.UPDATE.REQUEST,
                    payload: { displayName }
                })
            },
            valid: () => nameValid
        },
        password: {
            component: <>{!!user.message ? <Alert success>{t("account:" + user.message)}</Alert>
                : <form id={"changePassword"} onSubmit={event => { event.preventDefault(); forms.changePassword.action() }}>
                    <Textinput
                        value={pwd}
                        label={t("account:password")}
                        autocomplete={"password"}
                        validations={[
                            { fn: val => val.length >= 8, message: "account:password-invalid", callback: setPasswordValid }
                        ]}
                        type={"password"}
                        onChange={event => setPwd(event.target.value)}
                        name={'pwd'} />
                    <Textinput
                        value={newPwd}
                        label={t("account:newPassword")}
                        validations={[
                            { fn: val => val.length >= 8, message: "account:password-invalid", callback: setNewPwdValid }
                        ]}
                        type={"password"}
                        onChange={event => setNewPwd(event.target.value)}
                        name={'newPwd'} />
                    <Textinput
                        value={pwdRepeated}
                        label={t("account:newPasswordRepeated")}
                        validations={[
                            { fn: val => val.length >= 8, message: "account:password-invalid", callback: setPwdRepeatedValid }
                        ]}
                        type={"password"}
                        onChange={event => setPwdRepeated(event.target.value)}
                        name={'pwdRepeated'} />
                </form>}</>,
            action: () => {
                dispatch({
                    type: USER.CHANGE_PASSWORD.REQUEST,
                    payload: { password: pwd, 'new-password': newPwd, 'password-confirm': pwdRepeated }
                })
                setPwd("");
                setNewPwd("");
                setPwdRepeated("");
            },
            valid: () => passwordValid && newPwdValid && pwdRepeatedValid
        },
        email: {
            component: <>{!!user.message ? <Alert info>
                <Trans i18nKey={"account:" + user.message}>
                    0<strong>1</strong>2
                </Trans></Alert>
                :
                <form id={"changeLogin"} onSubmit={event => { event.preventDefault(); forms.changeLogin.action() }}>
                    <p>{t("account:current")}: {user.email}</p>
                    <Textinput
                        value={email}
                        label={t("account:newEmail")}
                        autocomplete={"username"}
                        validations={[
                            { fn: val => emailRegex.test(val), message: "account:email-invalid", callback: setEmailValid }
                        ]}
                        onChange={event => setEmail(event.target.value)}
                        name={'email'} />
                    <Textinput
                        value={pwd}
                        label={t("account:password")}
                        autocomplete={"password"}
                        validations={[
                            { fn: val => val.length >= 8, message: "account:password-invalid", callback: setPasswordValid }
                        ]}
                        type={"password"}
                        onChange={event => setPwd(event.target.value)}
                        name={'pwd'} />
                    <Alert info>{t("account:newEmailConfirmationRequired")}</Alert>
                </form>
            }</>,
            action: () => {
                dispatch({
                    type: USER.CHANGE_LOGIN.REQUEST,
                    payload: { login: email, password: pwd }
                });
                setPwd("");
            },
            valid: () => passwordValid && emailValid
        }
    }

    return (
        <section>
            <Well>
                <table className={'extra-padded'}>
                    <tbody>
                        <tr>
                            <td>{t("account:email")}</td>
                            <td>{user.email}</td>
                            <td className={"align-right"}>
                                <Button icon={'at'} onClick={() => setModalContent('email')} small>{t("gui:change")}</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("account:password")}</td>
                            <td><Secret></Secret></td>
                            <td className={"align-right"}>
                                <Button icon={'key'} onClick={() => setModalContent('password')} small>{t("gui:change")}</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("account:display_name")}</td>
                            <td>{user.displayName}</td>
                            <td className={"align-right"}>
                                <Button icon={'id-card'} onClick={() => setModalContent('display_name')} small>{t("gui:change")}</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("account:accountCreatedAt")}</td>
                            <td>{moment(user.createdAt, DB_DATE_FORMAT).format(t('dateFormat'))}</td>
                            <td className={"align-right"}>
                                {/* <Button icon={'exclamation-triangle'} dangerous small>{t("account:deleteAccount")}</Button> */}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Well>

            <div className="col-md-6 col-md-offset-3">
                <Alert info>
                {t("account:accountPrivacyInfo")}
                </Alert>
            </div>


            {modalContent !== null &&
                <Modal dismiss={() => {
                    if (!user.operationPending) {
                        setModalContent(null);
                        dispatch({ type: RESET_USER_ERRORS });
                    }
                }} actions={[
                    {
                        label: "discard",
                        align: "left",
                        disabled: user.operationPending,
                        action: () => {
                            setModalContent(null);
                            dispatch({ type: RESET_USER_ERRORS })
                        }
                    },
                    {
                        label: !!user.message ? "close" : "submit",
                        align: "right",
                        icon: user.operationPending ? "cog fa-spin" : "check",
                        template: "primary",
                        submitFor: forms[modalContent].id,
                        disabled: !forms[modalContent].valid(),
                        action: () => {
                            if (!!user.message) {
                                setModalContent(null);
                                dispatch({ type: RESET_USER_ERRORS });
                            } else {
                                forms[modalContent].action();
                            }
                        }
                    }
                ]} title={t("account:" + modalContent) + " " + t("change").toLowerCase()}>
                    {forms[modalContent]?.component}
                    <ServerError i18nKey={'account'} error={user.error} />
                </Modal>
            }

        </section>

    );
};

export default AccountInfo;