import styled from 'styled-components/macro';
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "../gui/_Icon";
import { Button } from "../gui/Button";
import { LG_SCREEN, MD_SCREEN, SM_SCREEN } from "../../config/constants";
import { template } from "lodash";
import { useBreakpoint } from "../../contexts/breakpoints";
import { Burgermenu } from "../gui/Burgermenu";
import LanguageSwitch from '../gui/LanguageSwitch';
import ButtonBar from '../gui/ButtonBar';

const Wrapper = styled.nav`
  background-color: white;
  padding: 0 3px;
  font-size: 1.1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.grey_5};
  
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
    padding: 8px 8px;
    text-decoration: none;
    font-weight: bold;
    /* text-transform: uppercase; */
    font-family: 'Quicksand', sans-serif;
    position: relative;
    /* border-left: 1px solid ${props => props.theme.grey_5}; */
    white-space: nowrap;
    width: 100%;
    z-index: 0;
    font-size: 1.1rem;
    letter-spacing: 1px;

    &.disabled {
        color: #ccc;
    }

    &:hover:before {
        height: 3px;
    }

    &.active:before {
        height: 8px;
    }

    &:before {
        position: absolute;
        background-color: ${props => props.theme.brand_primary};
        height: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: height 0.3s;
        content: "";
        z-index: -1;
    }
    
    &:last-child, &.single {
        /* border-right: 1px solid ${props => props.theme.grey_5}; */
        margin-right: 0.5rem;
    }

    ${MD_SCREEN} {
        border: none;
        font-size: 0.9rem;
        border-left: 1px solid ${props => props.theme.grey_5};

        &:last-child, &.single {
            border-right: 1px solid ${props => props.theme.grey_5};
            margin-right: 0.5rem;
        }
    } 
`;

const NavbarItemGroup = styled.div`
  display: flex;
  align-items: center;
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
    const { t } = useTranslation();
    const location = useLocation();
    const user = useSelector(state => state.user);
    const basket = useSelector(state => state.catalogue.basket);
    const dispatch = useDispatch();
    const { md } = useBreakpoint();


    const logo = <>
        <NavLink to={"/"}>
            <div style={{ position: 'relative', marginLeft: md ? 0 : 12, marginRight: md ? 12 : 0 }}>
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
        <Icon icon={"user-circle"} />&nbsp;
        {t("account:private")}
    </NavbarItem>

    const loginSignupLinks = <>
        <NavLink className={"no-styled-link"} to={'/signup?redirect=' + location.pathname}>
            <Button small={md} label={t("account:signup")} icon={"user-plus"} primary />
        </NavLink>&ensp;
        <NavLink className={"no-styled-link"} to={'/login'}>
            <Button small={md} label={t("account:login")} icon={"sign-in-alt"} />
        </NavLink>
    </>

    const basketButton = <NavbarItem className={`single ${basket.length === 0 && 'disabled'}`} id={"basket-nav-link"} to={'/basket'}>
        <Icon icon={"shopping-cart"} />&nbsp;
        {basket.length > 0 ?
            <>{t(md ? "commerce:basket" : "commerce:basketShort", { quantity: basket.length })}</>
            :
            <>{t("commerce:emptyBasket")}</>
        }
    </NavbarItem>

    return (
        <Wrapper tinyMenu={!md}>
            {md ?
                <>
                    <NavbarItemGroup>
                        {logo}
                        {sections}
                        {/* <a><LanguageSwitch /></a> */}
                    </NavbarItemGroup>

                    <NavbarItemGroup>
                        {basketButton}
                        <LanguageSwitch />&ensp;
                            {user.logged_in ? accountLink : loginSignupLinks}
                    </NavbarItemGroup>
                </>
                :
                <>
                    <NavbarItemGroup>
                        <Burgermenu headerAction={<LanguageSwitch />}>
                            {sections}
                            <hr />
                            {user.logged_in ? accountLink : loginSignupLinks}
                            <NavbarItem className={"no-styled-link"} to={'/info/de/66?Impressum'}>
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

export { Navbar, NavbarItem }