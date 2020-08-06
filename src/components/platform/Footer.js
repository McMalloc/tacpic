import styled, {useTheme} from 'styled-components/macro';
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

const Wrapper = styled.footer`
  display: flex;
  //flex:  0 0 auto;
  background-color: ${props => props.theme.brand_secondary};
  color: ${props => props.theme.background};
  justify-content: center;
  height: 36px;
  position: relative;
  align-items: center;
`;

const Version = styled.div`
  position: absolute;
  opacity: 0.8;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 90%;
  //align-self: center;
  right: 10px;
  background-color: red;
  text-shadow: 1px 1px 0 black;
  padding: 1px 3px;
  border-radius: 2px;
  font-weight: bold;
  border: 1px solid white;
`;

const Footer = props => {
    const {t} = useTranslation();
    const theme = useTheme();
    const user = useSelector(
        state => state.user
    );
    const backend = useSelector(
        state => state.app.backend
    );

    return (
        <Wrapper theme={theme}>
            <NavLink to={"/impressum"} className={"no-styled-link"}>
                Impressum
            </NavLink>
            &nbsp;

            <Version>
                <NavLink to={"/stats"} className={"no-styled-link"}>
                    backend: {backend && backend.tag}
                </NavLink>
            </Version>

        </Wrapper>
    )
};

export {Footer}