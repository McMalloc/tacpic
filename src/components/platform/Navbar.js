import styled, {useTheme} from 'styled-components/macro';
import React, {Component, Fragment} from "react";
import {useTranslation} from "react-i18next";
import AccountWidget from "./AccountWidget";
import {NavLink} from "react-router-dom";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "../gui/_Icon";
import {Button} from "../gui/Button";
import {USER} from "../../actions/action_constants";
import {template} from "lodash";


const Wrapper = styled.nav`
  display: flex;
  background-color: white;
   padding: 6px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.grey_5};
  justify-content: space-between;
`;

const NavbarItem = styled(NavLink)`
    //font-family: Quicksand, sans-serif;
    //font-weight: bold;
    color: ${props => props.theme.brand_secondary};
    text-decoration: none;
    border-radius: ${props => props.theme.border_radius};
    padding: ${props => props.theme.base_padding};
    position: relative;
    display: block;
    //text-shadow: 1px 1px 0 white;
    border: 1px solid transparent;
    // margin: ${props => props.small ? 0 : props.theme.spacing[1]} ${props => props.theme.spacing[2]};
    
    &:not(:last-child) {
      margin-right: ${props => props.theme.spacing[1]};
    }
    
    &:hover {
      border-color: ${props => props.theme.brand_secondary_verylight};
    }
   
   
    
    &.active {
    font-weight: bold;
      border-color: ${props => props.theme.brand_secondary_lighter};
    }
`;

const EmphasizedNavbarItem = styled(NavbarItem)`
  background-color: ${props => props.theme.brand_secondary};
  color: ${props => props.theme.background};
`;

const NavbarItemGroups = styled.div`
  display: flex;
  align-content: center;
  
  &:nth-child(2) {
    //border-left: 2px solid ${props => props.theme.brand_secondary_light}; 
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
    const basket = useSelector(state => state.catalogue.basket);
    const dispatch = useDispatch();

    return (
        <Wrapper theme={theme}>
            <NavbarItemGroups>
                <span style={{
                    color: "white",
                    backgroundColor: "red",
                    borderRadius: 3,
                    padding: 3
                }}> &bull; ALPHA &bull; </span>
                <NavLink style={{height: 30}} to={"/"}><Logo src={"/images/logo.svg"}/></NavLink>
                {props.items.map((item, idx) => {
                    return (
                        <NavbarItem theme={theme} key={idx} to={item.to}>
                            {t(item.label)}
                        </NavbarItem>
                    )
                })}
            </NavbarItemGroups>
            <NavbarItemGroups>
                {basket.length > 0 &&
                <NavbarItem id={"basket-nav-link"} theme={theme} to={'/basket'}>
                    <Icon icon={"shopping-cart"}/>&nbsp;
                    {template(t("general:Warenkorb"))({quantity: basket.length})}
                </NavbarItem>
                }

                {user.logged_in ?
                    <>
                        &ensp;<span style={{borderLeft: "1px solid lightgrey"}}>&ensp;</span>
                        <NavbarItem theme={theme} to={'/account'}>
                            <Icon icon={"user-circle"}/>&nbsp;
                            {t("general:my_account")}
                        </NavbarItem>
                    </>
                    :
                    <>
                        <NavLink className={"no-styled-link"} to={'/signup?redirect=' + location.pathname}>
                            <Button primary>
                                {t("general:signup")}
                            </Button>
                        </NavLink>
                        <NavbarItem theme={theme} to={'/login'}>
                            {t("general:login")}
                        </NavbarItem>
                    </>
                }


                {/*<AccountWidget/>*/}
            </NavbarItemGroups>
        </Wrapper>
    )
};

export {Navbar, NavbarItem}