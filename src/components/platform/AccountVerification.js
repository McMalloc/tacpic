import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router";
import {USER} from "../../actions/action_constants";
import {Textinput} from "../gui/Input";
import {useTranslation} from "react-i18next";
import {Icon} from "../gui/_Icon";
import {Button} from "../gui/Button";
import {NavLink, Redirect} from "react-router-dom";
import {Row} from "../gui/Grid";

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 ";

const requestVerification = (dispatch, password, passwordConfirm, key) => {
    dispatch({
        type: USER.VERIFY.REQUEST,
        payload: {key, password, "password-confirm": passwordConfirm}
    })
}

const AccountVerification = props => {
    const {t} = useTranslation();
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const key = new URLSearchParams(useLocation().search).get('key');

    const [pwd, setPwd] = useState("");
    const [pwdConfirm, setPwdConfirm] = useState("");

    const [pwdValid, setPwdValid] = useState(false);
    const [pwdConfirmValid, setPwdConfirmValid] = useState(false);

    if (user.verification_state === 3) {
        return <Redirect push to="/catalogue"/>;
    }

    return (
        <Row>
            <form className={layout} onSubmit={event => {
                event.preventDefault();
                pwdValid && pwdConfirmValid && requestVerification(dispatch, pwd, pwdConfirm, key)
            }}>
                <h1>Noch ein Schritt</h1>
                <p>Nachdem Sie Ihre E-Mail-Adresse bestätigt haben, müssen SIe sich nur noch ein Passwort ausdenken.</p>
                <Textinput
                    value={pwd}
                    label={t("general:password")}
                    autocomplete={"new-password"}
                    sublabel={"general:password-hint"}
                    validations={[
                        {
                            fn: val => val.length >= 8,
                            message: "general:password-invalid",
                            callback: setPwdValid
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
                            callback: setPwdConfirmValid
                        }
                    ]}
                    onChange={event => setPwdConfirm(event.target.value)}
                    name={'pwdConfirm'}/>

                {user.verification_state === 2 ?
                    (<Icon icon={"cog fa-spin"}/>) :
                    (<>
                        <div style={{textAlign: "center"}}>
                            <Button disabled={!(pwdConfirmValid && pwdValid)} primary
                                    type={'submit'}>{t("general:Passwort setzen")}</Button>
                        </div>
                    </>)
                }
            </form>

        </Row>
    );
};

export default AccountVerification;