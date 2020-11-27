import styled from 'styled-components/macro';
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "../gui/_Icon";
import {Button} from "../gui/Button";
import {LG_SCREEN, MD_SCREEN, SM_SCREEN} from "../../config/constants";
import {template} from "lodash";
import {useBreakpoint} from "../../contexts/breakpoints";
import {Burgermenu} from "../gui/Burgermenu";

const Wrapper = styled.nav`
  /* display: flex; */
  background-color: white;
  padding: 6px;
  font-size: 1.1rem;
  /* flex: 0 1 auto; */
  /* flex-wrap: wrap; */
  /* width: 100%; */
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.grey_5};
  /* justify-content: space-between; */

  a {
      margin-left: 0.5rem;
  }
  
  ${SM_SCREEN} {
    
  }  
  ${MD_SCREEN} {
    font-size: 1rem;
  }  
  ${LG_SCREEN} {
    //background-color: blue;
  }
`;

const NavbarItem = styled(NavLink)`
    color: ${props => props.theme.brand_secondary};
    text-decoration: none;
    /* border-radius: ${props => props.theme.border_radius}; */
    margin: 0 ${props => props.theme.large_padding};
    position: relative;
    border-bottom: 3px solid transparent;
    border-top: 4px solid transparent!important;
    /* font-family: "Quicksand", sans-serif; */
    white-space: nowrap;
    /* flex: 0 1 0; */

    &.active:before {
        background-color: ${props => props.theme.brand_primary};
    }
    
    &:not(:last-child) {
      margin-right: ${props => props.theme.spacing[1]};
    }
    
    &:hover {
      border-color: ${props => props.theme.brand_secondary_verylight};
    }
   
    &.active {
      font-weight: bold;
      border-color: ${props => props.theme.brand_primary};
    }
`;

const EmphasizedNavbarItem = styled(NavbarItem)`
  background-color: ${props => props.theme.brand_secondary};
  color: ${props => props.theme.background};
`;

const NavbarItemGroup = styled.div`
  display: flex;
  align-content: center;
  /* flex: 0 1 0; */
  float: left;

  &:last-child {
    float: right;
  }
`;

const Logo = styled.img`
  width: 80px;
  align-self: center;
  background-repeat: no-repeat;
`;

const Badge = styled.div`
    color: white;
    font-size: 11px;
    background-color: rgba(255, 30, 30, 0.5);
    text-shadow: 1px 1px 0 rgba(0,0,0,0.4);
    position: absolute;
    left: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
    right: 5px;
    top: 0;
    font-weight: bold;
    border-radius: 3;
    padding: 0 3px;
`;

const Navbar = props => {
    const {t} = useTranslation();
    const location = useLocation();
    const user = useSelector(state => state.user);
    const basket = useSelector(state => state.catalogue.basket);
    const dispatch = useDispatch();
    const {md} = useBreakpoint();


    const logo = <>
        <NavLink to={"/"}>
            <div style={{position: 'relative', marginLeft: md ? 0 : 12, marginRight:  md ? 12 : 0}}>
                <Logo src={"/images/logo.svg"} />
                <Badge>Alpha</Badge>
            </div>
        </NavLink>
    </>

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
            <Button label={t("general:signup")} icon={"user-plus"} primary />
        </NavLink>
        <NavLink className={"no-styled-link"} to={'/login'}>
            <Button label={t("general:login")} icon={"sign-in-alt"} />
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
        <Wrapper tinyMenu={!md}>
            {md ?
                <>
                    <NavbarItemGroup>
                        {logo}
                    </NavbarItemGroup>
                    <NavbarItemGroup>
                        {sections}
                    </NavbarItemGroup>

                    <NavbarItemGroup>
                        {basketButton}

                        {user.logged_in ? accountLink : loginSignupLinks}
                    </NavbarItemGroup>
                </>
                :
                <>
                    <NavbarItemGroup>
                        <Burgermenu>
                            {sections}
                            <hr/>
                            {user.logged_in ? accountLink : loginSignupLinks}
                            <NavbarItem className={"no-styled-link"} to={'/legal/de/Impressum'}>
                                Impressum
                            </NavbarItem>
                        </Burgermenu>
                        {logo}
                    </NavbarItemGroup>
                    <NavbarItemGroup>
                        {basketButton}
                    </NavbarItemGroup>
                </>
            }
        </Wrapper>
    )
};

export {Navbar, NavbarItem}