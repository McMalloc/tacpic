import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {USER} from "../../../actions/action_constants";
import {Textinput} from "../../gui/Input";
import {useTranslation} from "react-i18next";
import {Icon} from "../../gui/_Icon";
import {Button} from "../../gui/Button";
import {NavLink, Navigate} from "react-router-dom";
import {Row} from "../../gui/Grid";
import {Alert} from "../../gui/Alert";
import ServerError from "../ServerError";

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 ";

const requestReset = (dispatch, password, passwordConfirm, key) => {
    dispatch({
        type: USER.RESET.REQUEST,
        payload: {key, password, "password-confirm": passwordConfirm}
    })
}

const ResetPassword = props => {
    const {t} = useTranslation();
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const key = new URLSearchParams(useLocation().search).get('key');
    const navigate = useNavigate();

    const [pwd, setPwd] = useState("");
    const [pwdConfirm, setPwdConfirm] = useState("");

    const [pwdValid, setPwdValid] = useState(false);
    const [pwdConfirmValid, setPwdConfirmValid] = useState(false);

    if (user.reset_state === 3) {
        navigate("/login");
    }

    if (key === null || key.length === 0) {
        return <Alert warning>{t("auth:pwReset.invalidKey")}</Alert>
    }

    return (
        <Row>
            <form className={layout} onSubmit={event => {
                event.preventDefault();
                pwdValid && pwdConfirmValid && requestReset(dispatch, pwd, pwdConfirm, key)
            }}>
                <h1>{t("auth:pwReset.heading")}</h1>
                <p>{t("auth:pwReset.enterTwice")}</p>
                <Textinput
                    value={pwd}
                    label={"account:password"}
                    autocomplete={"new-password"}
                    sublabel={"account:password-hint"}
                    validations={[
                        {
                            fn: val => val.length >= 8,
                            message: "account:password-invalid",
                            callback: setPwdValid
                        }
                    ]}
                    type={"password"}
                    onChange={event => setPwd(event.target.value)}
                    name={'pwd'}/>
                <Textinput
                    value={pwdConfirm}
                    autocomplete={"new-password"}
                    label={"account:password-confirm"}
                    type={"password"}
                    validations={[
                        {
                            fn: val => val === pwd,
                            message: "account:password-confirm-invalid",
                            callback: setPwdConfirmValid
                        }
                    ]}
                    onChange={event => setPwdConfirm(event.target.value)}
                    name={'pwdConfirm'}/>

                <ServerError i18nKey={'account'} error={user.error}/>


                <div style={{textAlign: "center"}}>
                    <Button disabled={!(pwdConfirmValid && pwdValid) || user.reset_state === 2} primary label={"account:pwReset.submit"}
                            icon={user.reset_state === 2 ? "cog fa-spin" : "key"}
                            type={'submit'} />
                </div>
            </form>

        </Row>
    );
};

export default ResetPassword;