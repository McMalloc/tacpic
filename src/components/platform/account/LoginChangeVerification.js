import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { USER, RESET_USER_ERRORS } from "../../../actions/action_constants";
import Loader from "../../gui/Loader";
import { Alert } from "../../gui/Alert";
import Well from "../../gui/Well";
import { useTranslation } from "react-i18next";
import { Row } from "../../gui/Grid";
import ServerError from "../ServerError";

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 ";

const LoginChangeVerification = props => {
    const { t } = useTranslation();
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const key = new URLSearchParams(useLocation().search).get('key');

    useEffect(() => {
        dispatch({
            type: USER.VERIFY_LOGIN_CHANGE.REQUEST,
            payload: { key }
        })
        return () => dispatch({type: RESET_USER_ERRORS})
    }, []);

    return (
        <Row>
            <h1 className={layout}>Änderung bestätigen</h1>
            <div className={layout}>
                {!!user.message ?
                    <><Alert success>Ok!</Alert>
                        Zurück</>
                    : !!user.error ? <><ServerError error={user.error} /> Zurück</>
                        :
                        <>
                            <Loader></Loader>
                            <p>{t('account:verifyLoginChangeInProgress')}</p></>
                }
            </div>
        </Row>
    );
};

export default LoginChangeVerification;