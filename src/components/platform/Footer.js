import styled, {useTheme} from 'styled-components';
import React, {Component, Fragment} from "react";
import {useTranslation} from "react-i18next";
import AccountWidget from "./AccountWidget";
import {NavLink} from "react-router-dom";
import {useLocation} from "react-router";
import {useSelector} from "react-redux";
import {Icon} from "../gui/_Icon";

const Wrapper = styled.footer`
  display: flex;
  flex:  0 0 auto;
  background-color: ${props => props.theme.brand_secondary};
  color: ${props => props.theme.background};
  justify-content: center;
`;

const Footer = props => {
    const {t} = useTranslation();
    const theme = useTheme();
    const user = useSelector(
        state => state.user
    );

    return (
        <Wrapper theme={theme}>
            <NavLink to={"/impressum"} className={"no-styled-link"}>
                Impressum
            </NavLink>

        </Wrapper>
    )
};

export {Footer}