import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "./gui/Button";
import {VARIANT, FILE, USER} from "../actions/action_constants";
import {Row} from "./gui/Grid";
import styled, {useTheme} from "styled-components/macro";
import {useTranslation} from "react-i18next";
import {Icon} from "./gui/_Icon";
import {TagView} from "./platform/Tag";
import {Textinput} from "./gui/Input";
import {NavLink, Navigate} from "react-router-dom";
import LoginForm from "./LoginForm";
import {Alert} from "./gui/Alert";

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4";

const Login = props => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    if (user.logged_in) {
        return navigate("/catalogue");
    }

    return (
        <>
            <div className={"row extra-margin"}>
                <div className={layout}>
                    <h1>{t("general:login")}</h1>
                    {user.reset_state === 3 &&
                        <Alert info>Ihr Passwort wurde zurückgesetzt. Bitte melden Sie sich mit Ihrem neuen Passwort an.</Alert>
                    }
                </div>
            </div>

            <div className={"row"}>
                <LoginForm />
                <>

                    <div className={'full-width align-center'}>
                        <br />
                        <p>
                            {t("general:signup-cta")} <NavLink to={"/signup"}>{t("general:signup-here")}</NavLink>
                        </p>
                    </div>
                </>
            </div>
        </>

    );
};

export default Login;