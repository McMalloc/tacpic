import styled, {useTheme} from 'styled-components';
import React, {Component, Fragment} from "react";
import {useTranslation} from "react-i18next";
import AccountWidget from "./AccountWidget";
import {NavLink} from "react-router-dom";
import {useLocation} from "react-router";

const Wrapper = styled.nav`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.brand_secondary};
  align-items: stretch;
  //justify-content: center;
  justify-items: stretch;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
`;

const NavbarItem = styled(NavLink)`
    border-left: 1px solid transparent;
    &:last-child {
      border-right: 1px solid transparent;
    }
   
    padding: ${props => props.theme.base_padding} ${props => props.theme.large_padding};
    font-family: Quicksand, sans-serif;
    //font-weight: bold;
    color: ${props => props.theme.brand_secondary};
    font-size: 1.1em;
    position: relative;
    display: block;
    
    &.active {
      border-bottom: 2px solid ${props => props.theme.brand_secondary};
      border-left: 1px solid ${props => props.theme.brand_secondary};
      border-right: 1px solid ${props => props.theme.brand_secondary};
      background-color: ${props => props.theme.grey_6};
      
    }
`;

const Logo = styled.img`
  width: 80px;
  padding: 4px 16px;
  align-self: center;
  background-repeat: no-repeat;
`;

const Navbar = props => {
    const {t} = useTranslation();
    const location = useLocation();
    const theme = useTheme();
    return (
        <Wrapper theme={theme}>
            <Logo src={"/images/logo.svg"}/>
            {props.items.map((item, idx) => {
                return (
                    <NavbarItem theme={theme} key={idx} className={"no-styled-link"} to={item.to}>
                        {t(item.label)}
                    </NavbarItem>
                )
            })}

            <NavbarItem theme={theme} className={"no-styled-link"} to={'/login'}>
                Login
            </NavbarItem>
            {/*<AccountWidget/>*/}
        </Wrapper>
    )
};

export {Navbar, NavbarItem}