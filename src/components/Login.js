import React, {useState} from "react";
import {useHistory, useParams, useRouteMatch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "./gui/Button";
import {VARIANT, FILE, USER} from "../actions/action_constants";
import {Row} from "./gui/Grid";
import styled, {useTheme} from "styled-components";
import {useTranslation} from "react-i18next";
import {Icon} from "./gui/_Icon";
import {TagView} from "./platform/Tag";
import {Textinput} from "./gui/Input";
import {NavLink, Redirect} from "react-router-dom";
import LoginForm from "./LoginForm";

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4";

const Login = props => {
    const {t} = useTranslation();
    const user = useSelector(state => state.user);

    if (user.logged_in) {
        return <Redirect push to="/catalogue"/>;
    }

    return (
        <>
            <div className={"row extra-margin"}>
                <h1 className={layout}>{t("general:login")}</h1>
            </div>

            <div className={"row"}>
                <LoginForm />
                <>

                    <div className={'full-width align-center'}>
                        <br />
                        <p>
                            Haben Sie noch kein Konto? <NavLink to={"/signup"}>Hier registrieren.</NavLink>
                        </p>
                    </div>
                </>
            </div>
        </>

    );
};

export default Login;