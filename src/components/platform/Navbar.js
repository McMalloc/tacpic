import styled from 'styled-components';
import React, {Component, Fragment} from "react";
import {useTranslation} from "react-i18next";

const Wrapper = styled.nav`
  
`;

const Navbar = props => {
    return (
        <Wrapper>

        </Wrapper>
    )
};

const NavbarItem = props => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            {props.title}
        </Wrapper>
    )
};

export {Navbar, NavbarItem}