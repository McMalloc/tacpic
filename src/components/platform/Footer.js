import styled, {useTheme} from 'styled-components';
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {USER} from "../../actions/constants";

const Wrapper = styled.footer`
  display: flex;
  flex:  0 0 auto;
  background-color: ${props => props.theme.brand_secondary};
  color: ${props => props.theme.background};
  justify-content: center;
  position: relative;
`;

const Version = styled.div`
  position: absolute;
  opacity: 0.8;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 90%;
  align-self: center;
  right: 10px;
`;

const Footer = props => {
    const {t} = useTranslation();
    const theme = useTheme();
    const user = useSelector(
        state => state.user
    );
    useEffect(() => {
        fetch("/VERSION.txt").then(response => response.text()).then(data=> {
            window.FRONTEND_VERSION = data;
        });
        fetch("/BACKEND_VERSION.txt").then(response => response.text()).then(data=> {
            window.BACKEND_VERSION = data;
        });
    }, []);

    return (
        <Wrapper theme={theme}>
            <NavLink to={"/impressum"} className={"no-styled-link"}>
                Impressum
            </NavLink>
            &nbsp;

            <Version>
                frontend: <strong>{window.FRONTEND_VERSION}</strong> | backend: <strong>{window.BACKEND_VERSION}</strong>
            </Version>

        </Wrapper>
    )
};

export {Footer}