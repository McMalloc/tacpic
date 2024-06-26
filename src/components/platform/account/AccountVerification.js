import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import {USER, RESET_USER_ERRORS} from "../../../actions/action_constants";
import {Textinput} from "../../gui/Input";
import {useTranslation} from "react-i18next";
import {Icon} from "../../gui/_Icon";
import {Button} from "../../gui/Button";
import {NavLink, Navigate} from "react-router-dom";
import {Row} from "../../gui/Grid";

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

    useEffect(() => () => dispatch({type: RESET_USER_ERRORS}), []);

    return (
        <Row>
            <form className={layout} onSubmit={event => {
                event.preventDefault();
                pwdValid && pwdConfirmValid && requestVerification(dispatch, pwd, pwdConfirm, key)
            }}>
                <h1>{t('account:oneMoreStep')}</h1>
                <p>{t('account:pwConfirmCopy')}</p>
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


                <div style={{textAlign: "center"}}>
                    <Button icon={user.verification_state === 2 ? "cog fa-spin" : "check"}
                    label={'account:submitPassword'}
                            disabled={!(pwdConfirmValid && pwdValid) || user.verification_state === 2} primary
                            type={'submit'} />
                </div>

            </form>

        </Row>
    );
};

export default AccountVerification;