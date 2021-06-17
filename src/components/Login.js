import React from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import LoginForm from "./LoginForm";
import {Alert} from "./gui/Alert";

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4";

const Login = props => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    if (user.logged_in) {
        setTimeout(() => navigate('/catalogue'));
    }

    return (
        <>
            <div className={"row extra-margin"}>
                <div className={layout}>
                    <h1>{t("account:login")}</h1>
                    {user.reset_state === 3 &&
                        <Alert info>{t("general:passwordResetted")}</Alert>
                    }
                </div>
            </div>

            <div className={"row"}>
                <div className={layout}>
                    <LoginForm />
                </div>
                <>

                    <div className={'full-width align-center'}>
                        <br />
                        <p>
                            {t("account:signup-cta")} <NavLink to={"/signup"}>{t("account:signup-here")}</NavLink>
                        </p>
                    </div>
                </>
            </div>
        </>

    );
};

export default Login;