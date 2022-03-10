import styled from 'styled-components/macro';
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "../gui/_Icon";
import { Button } from "../gui/Button";
import { LG_SCREEN, SM_SCREEN } from "../../config/constants";
import { useBreakpoint } from "../../contexts/breakpoints";
import { Burgermenu } from "../gui/Burgermenu";
import LanguageSwitch from '../gui/LanguageSwitch';

const Wrapper = styled.nav`
  background-color: white;
  font-size: 1.1rem;
  min-height: 39px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.grey_5};
`;

const NavbarItem = styled(NavLink)`
    color: ${props => props.restrictedlink ? props.theme.background : props.theme.brand_secondary};
    background-color: ${props => props.restrictedlink ? props.theme.danger : props.theme.background};
    padding: 8px 8px;
    box-sizing: border-box;
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
    display: flex;
    align-items: center;
    letter-spacing: 1px;

    &.two-lines {
        font-family: Roboto, sans-serif;
        letter-spacing: 0;
        padding: 4px 8px;
        line-height: 90%;
    }

    .really-small {
        font-weight: normal;
        font-size: 0.85rem;
    }

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

    ${LG_SCREEN} {
        border: none;
        
        border-left: 1px solid ${props => props.theme.grey_5};
        .really-small {
            font-size: 0.7rem;
        }

        &:last-child, &.single {
            border-right: 1px solid ${props => props.theme.grey_5};
            margin-right: 0.5rem;
        }
    } 

    ${SM_SCREEN} {
        font-size: 0.9rem;
    } 
`;

const NavbarItemGroup = styled.div`
  display: flex;
  align-items: stretch;
`;

const Logo = styled.img`
  width: 80px;
  padding: 5px;
  align-self: center;
  background-repeat: no-repeat;
`;

const Badge = styled.div`
    color: rgba(205, 30, 30, 0.8);
    font-size: 11px;
    border: 1px solid rgba(205, 30, 30, 0.8);
    position: absolute;
    left: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
    right: 5px;
    bottom: 0;
    font-weight: bold;
    border-radius: 3;
    padding: 0 3px;
`;

const Navbar = props => {
    const { t } = useTranslation();
    const location = useLocation();
    const user = useSelector(state => state.user);
    const basket = useSelector(state => state.catalogue.basket);
    const { md, lg } = useBreakpoint();
    const navigate = useNavigate();


    const logo = <>
        <NavLink aria-label={t('tacpicToStart')} to={"/"}>
            <div aria-hidden={'true'} style={{ position: 'relative', alignSelf: 'center' }}>
                <Logo alt={''} src={"/images/logo.svg"} />
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

    if (!!user.userRights && user.userRights.can_view_admin) sections.push(
        <NavbarItem restrictedlink={'true'} key={sections.length} to={'/admin/start'}>
            <Icon icon={"tools"} />
            {/* &nbsp; */}
            {/* {t('navigation.admin')} */}
        </NavbarItem>
    )

    const accountLink = <>
        <NavbarItem data-pom={'accountLink'} aria-label={t('account:accountOf') + ' ' + user.email} className={'two-lines'} to={'/account'}>
            <Icon icon={"user-circle"} />&nbsp;
            <div aria-hidden={true}>
                <span className={'really-small'}>
                    {t('account:accountOf')}
                    </span> <br />
                {user.email}
            </div>
            {/* {t("account:private")} */}
        </NavbarItem></>

    const loginSignupLinks = <>
        <Button style={{ alignSelf: 'center' }} onClick={() => navigate('/signup?redirect=' + location.pathname)} small={lg} label={t("account:signup")} icon={"user-plus"} primary />
        &ensp;
        <Button data-pom={'loginButton'} style={{ alignSelf: 'center' }} onClick={() => navigate('/login?redirect=' + location.pathname)} small={lg} label={t("account:login")} icon={"sign-in-alt"} />
    </>

    const basketButton = <NavbarItem aria-label={t("commerce:basket", { quantity: basket.length })} className={`single ${basket.length === 0 && 'disabled'}`} id={"basket-nav-link"} to={'/basket'}>
        <Icon icon={"shopping-cart"} />&nbsp;
        {basket.length > 0 ?
            <>{t(lg ? "commerce:basket" : "commerce:basketShort", { quantity: basket.length })}</>
            :
            <></>
            // <>{t("commerce:emptyBasket")}</>
        }
    </NavbarItem>

    return (
        <Wrapper tinyMenu={!lg}>
            {lg ?
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
                            <br />
                            {sections}
                            <hr aria-hidden={true}/>
                            {user.logged_in ? accountLink : loginSignupLinks}
                            <NavbarItem className={"no-styled-link"} to={'/info/de/66?Impressum'}>
                                {t("footer:imprint")}
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