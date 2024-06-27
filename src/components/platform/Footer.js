import styled from 'styled-components/macro';
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import i18n from 'i18next';
import { useSelector } from "react-redux";
import { Row } from "../gui/Grid";
import { Icon } from "../gui/_Icon";
import { MD_SCREEN } from '../../config/constants';
import Loader from '../gui/Loader';

const FooterStyled = styled.footer`
   background-color: ${props => props.theme.brand_secondary};
   color: ${props => props.theme.background};
   font-size: 0.8rem;
   line-height: 120%;
   position: relative;
   padding: ${props => props.small ? "0.5rem 0" : '1rem 0 1.5rem 0'};
   display: flex;
   justify-content: center;
   gap: 1.5rem;
   flex-wrap: wrap;

   ${MD_SCREEN} {
       font-size: 0.9rem;
   }
   
   a {
      color: inherit;
      display: inline-block;
   }
   
   span.heading {
      text-transform: uppercase;
      display: block;
      letter-spacing: 1px; 
      font-size: 0.8rem;
      opacity: 0.8;
      margin-bottom: 3px;
   }
`;

const FooterImageContainer = styled.span`
  display: block;
  background-color: white;
  padding: 6px;
  border-radius: ${props => props.theme.border_radius};
`

const Version = styled.div`
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 0.8rem;
  color: lightgreen;
  padding: 1px 3px;
  border-radius: 2px;
  font-weight: bold;
  //border: 1px solid white;
`;

const Footer = props => {
    const { t } = useTranslation();
    const legalTexts = useSelector(
        state => state.cms.legal.menu
    );
    const { backend, frontend } = useSelector(
        state => state.app
    );

    return (
        <FooterStyled small={props.small}>

            <>
                {/* <span className={"heading"}>{t('footer:informationHeading')}</span> */}
                {legalTexts.map((text, index) => {
                    return <span className="element" key={index}><NavLink
                        to={`/info/${i18n.language}/${text.id}?${text.title}`}>
                        {t('legal:' + text.title)}</NavLink></span>
                })}
                {legalTexts.length === 0 && <Loader frugal />}
            </>
        </FooterStyled>

    )
};

export { Footer }