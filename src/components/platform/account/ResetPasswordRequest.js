import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Icon} from "../../gui/_Icon";
import {Button} from "../../gui/Button";
import {Textinput} from "../../gui/Input";
import {USER} from "../../../actions/action_constants";
import ServerError from "../ServerError";
import { Trans } from "react-i18next";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4";

const ResetPasswordRequest = props => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    // input states
    const [email, setEmail] = useState('');

    // input validities
    const [emailValid, setEmailValid] = useState(false);

    return (
        <section className={layout}>
            <h1>{t("account:pwReset.heading")}</h1>
            {user.reset_state === 1 ?
                <>
                    <p>
                        <Trans i18nKey={'account:pwReset.mailSent'}>
                            <strong>0</strong><br />2
                        </Trans>
                    </p>
                    <p className={"align-center"}>
                        <Icon icon={'envelope fa-3x'}/>
                    </p>
                </>
                :
                <>
                    <p>{t("account:pwReset.enterMail")}</p>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        dispatch({
                            // emailValid && passwordValid && dispatch({
                            type: USER.RESET_REQUEST.REQUEST,
                            payload: {login: email}
                        });
                    }}>
                        <Textinput
                            value={email}
                            label={"account:email"}
                            autocomplete={"username"}
                            validations={[
                                {
                                    fn: val => emailRegex.test(val),
                                    message: "account:email-invalid",
                                    callback: setEmailValid
                                }
                            ]}
                            onChange={event => setEmail(event.target.value)}
                            name={'email'}/>

                        <ServerError i18nKey={'account'} error={user.error}/>

                        <div className={'align-center'}>
                            {/*<input type={"submit"} value={"login"}/>*/}
                            <Button primary disabled={!(emailValid) || user.reset_state === 0}
                                    label={'submit'} icon={user.reset_state === 0 ? "cog fa-spin" : "check"}
                                    type={'submit'} />
                        </div>
                    </form>
                </>
            }
        </section>
    );
};

export default ResetPasswordRequest;