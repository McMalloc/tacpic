import styled from 'styled-components/macro';
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "../gui/_Icon";
import {Button} from "../gui/Button";
import {LG_SCREEN, MD_SCREEN, SM_SCREEN} from "../../config/constants";
import {template} from "lodash";
import {useBreakpoint} from "../../contexts/breakpoints";
import breakpoint from "styled-components-breakpoint";
import {Burgermenu} from "../gui/Burgermenu";

const Wrapper = styled.nav`
  display: flex;
  background-color: white;
  padding: ${props => props.tinyMenu ? 0 : '6px'};
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.grey_5};
  justify-content: space-between;
  
  ${SM_SCREEN} {
    //background-color: yellow;
  }  
  ${MD_SCREEN} {
    //background-color: green;
  }  
  ${LG_SCREEN} {
    //background-color: blue;
  }
`;

const NavbarItem = styled(NavLink)`
    color: ${props => props.theme.brand_secondary};
    text-decoration: none;
    border-radius: ${props => props.theme.border_radius};
    padding: ${props => props.theme.base_padding};
    position: relative;
    display: block;
    border: 1px solid transparent;
    font-family: "Quicksand", sans-serif;
    font-size: 18px;
    
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
    const user = useSelector(state => state.user);
    const basket = useSelector(state => state.catalogue.basket);
    const dispatch = useDispatch();
    const breakpoints = useBreakpoint();


    const logo = <NavbarItemGroups>

        <NavLink style={{height: 30}} to={"/"}><Logo src={"/images/logo.svg"}/></NavLink>
        <span style={{
            color: "white",
            fontSize: '12px',
            backgroundColor: "red",
            borderRadius: 3,
            padding: 3
        }}> ALPHA </span>
    </NavbarItemGroups>

    const sections = props.items.map((item, idx) => {
        return (
            <NavbarItem key={idx} to={item.to}>
                {t(item.label)}
            </NavbarItem>
        )
    })

    const accountLink = <NavbarItem to={'/account'}>
        <Icon icon={"user-circle"}/>&nbsp;
        {t("general:my_account")}
    </NavbarItem>

    const loginSignupLinks = <>
        <NavLink className={"no-styled-link"} to={'/signup?redirect=' + location.pathname}>
            <Button icon={"user-plus"} primary>
                {t("general:signup")}
            </Button>
        </NavLink>&ensp;
        <NavLink className={"no-styled-link"} to={'/login'}>
            <Button icon={"sign-in-alt"}>
                {t("general:login")}
            </Button>
        </NavLink>
    </>

    const basketButton = <NavbarItem id={"basket-nav-link"} to={'/basket'}>
        <Icon icon={"shopping-cart"}/>&nbsp;
        {basket.length > 0 ?
            <>{template(t("general:basket"))({quantity: basket.length})}</>
            :
            <>{t("general:empty_basket")}</>
        }
    </NavbarItem>

    return (
        <Wrapper tinyMenu={!breakpoints.sm}>
            {breakpoints.sm ?
                <>
                    <NavbarItemGroups>
                        {logo}
                        {sections}
                    </NavbarItemGroups>

                    <NavbarItemGroups>
                        {basketButton}

                        {user.logged_in ? accountLink : loginSignupLinks}
                    </NavbarItemGroups>
                </>
                :
                <>
                    <NavbarItemGroups>
                        <Burgermenu>
                            {sections}
                            <hr />
                            {user.logged_in ? accountLink : loginSignupLinks}
                        </Burgermenu>
                        {logo}
                    </NavbarItemGroups>
                    <NavbarItemGroups>
                        {basketButton}
                    </NavbarItemGroups>
                </>
            }
        </Wrapper>
    )
};

export {Navbar, NavbarItem}