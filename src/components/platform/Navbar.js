import styled, {useTheme} from 'styled-components';
import React, {Component, Fragment} from "react";
import {useTranslation} from "react-i18next";
import AccountWidget from "./AccountWidget";
import {NavLink} from "react-router-dom";
import {useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "../gui/_Icon";
import {Button} from "../gui/Button";
import {USER} from "../../actions/constants";


const Wrapper = styled.nav`
  display: flex;
  background-color: white;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.brand_secondary};
  justify-content: space-between;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
`;

const NavbarItem = styled(NavLink)`
    border-left: 1px solid transparent;
    &:last-child {
      border-right: 1px solid transparent;
    }
   
    padding: ${props => props.theme.base_padding} ${props => props.theme.large_padding};
    font-family: Quicksand, sans-serif;
    color: ${props => props.theme.brand_secondary};
    position: relative;
    display: block;
   
    
    &.active {
      background-color: ${props => props.theme.brand_secondary};
      color: ${props => props.theme.background};
    }
`;

const NavbarItemGroups = styled.div`
  display: flex;
  align-content: center;
  
  &:nth-child(2) {
    border-left: 1px solid ${props => props.theme.brand_secondary}; 
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
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    return (
        <Wrapper theme={theme}>
            <NavbarItemGroups>
                <NavLink style={{height: 30}} to={"/"}><Logo src={"/images/logo.svg"}/></NavLink>
                {props.items.map((item, idx) => {
                    return (
                        <NavbarItem theme={theme} key={idx} className={"no-styled-link"} to={item.to}>
                            {t(item.label)}
                        </NavbarItem>
                    )
                })}
            </NavbarItemGroups>
            <NavbarItemGroups>
                {user.logged_in ?
                    <>
                    <NavbarItem theme={theme} className={"no-styled-link"} to={'/account'}>
                        {/*<span style={{fontSize: '1.4em'}}>*/}
                    <Icon icon={"user-circle"}/>&nbsp;
                {/*</span>*/}
                        {t("general:my_account")}
                    </NavbarItem>
                    {/*<Button small onClick={() => {*/}
                    {/*    dispatch({*/}
                    {/*        type: USER.LOGOUT.REQUEST*/}
                    {/*    })*/}
                    {/*}*/}
                    {/*}>Ausloggen</Button>*/}
                    </>
                    :
                    <>
                    <NavbarItem theme={theme} className={"no-styled-link"} to={'/login'}>
                        {t("general:login")}
                    </NavbarItem>
                    <NavbarItem theme={theme} className={"no-styled-link"} to={'/signup'}>
                        {t("general:signup")}
                    </NavbarItem>
                    </>
                }



                {/*<AccountWidget/>*/}
            </NavbarItemGroups>
        </Wrapper>
    )
};

export {Navbar, NavbarItem}