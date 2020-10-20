import styled, {useTheme} from 'styled-components/macro';
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import i18n from 'i18next';
import {useSelector} from "react-redux";
import {Row} from "../gui/Grid";
import {Icon} from "../gui/_Icon";

const FooterStyled = styled.footer`
   background-color: ${props => props.theme.brand_secondary};
   color: ${props => props.theme.background};
   font-size: 0.9em;
   line-height: 120%;
   
   a {
      color: inherit;
      display: inline-block;
      padding-left: 1.5em;
      text-indent: -1.5em;
   }
   
   span.heading {
      text-transform: uppercase;
      display: block;
      letter-spacing: 1px; 
      font-size: 0.8em;
      opacity: 0.8;
      margin-bottom: 3px;
   }
`;

const FooterImageContainer = styled.div`
  background-color: white;
  padding: 6px;
  border-radius: ${props => props.theme.border_radius};
`

const Version = styled.div`
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 80%;
  color: lightgreen;
  padding: 1px 3px;
  border-radius: 2px;
  font-weight: bold;
  //border: 1px solid white;
`;

const Footer = props => {
    const {t} = useTranslation();
    const user = useSelector(
        state => state.user
    );
    const legalTexts = useSelector(
        state => state.app.legalTexts
    );
    const {backend, frontend} = useSelector(
        state => state.app
    );

    return (
        <FooterStyled>
            <div className={"container"}>
                &ensp;
                <Row>
                    <div className={"col-md-4"}>
                        <p>
                            <span className={"heading"}>Information</span>
                            {legalTexts.map((text, index) => {
                                return <span key={index}><NavLink to={`/legal/${i18n.language}/${t(text.title)}`}>{text.title}</NavLink> <br/></span>
                            })}
                        </p>

                        <p>

                        </p>
                    </div>
                    <div className={"col-md-5"}>
                        <p>
                            <span className={"heading"}>Kontakt</span>
                            tacpic UG (haftungsbeschränkt) <br />
                            FEZ Raum 3.13 <br />
                            Breitscheidstraße 51 <br />
                            39114 Magdeburg
                        </p>
                        <p>
                            <Icon icon={"phone-alt"} />&emsp;<a href={"tel://0176 43486710"}>0176 43486710</a><br/>
                            <Icon icon={"envelope"} />&emsp;<a href={"mailto://kontakt@tacpic.de"}>kontakt@tacpic.de</a>
                        </p>
                    </div>
                    <div className={"col-md-3"} style={{paddingRight: "4em"}}>
                        <img src={"/images/logo_dark.svg"} />

                        <FooterImageContainer>
                            <a href={"https://europa.sachsen-anhalt.de"}>
                                <img alt={"Das Projekt tacpic wird vom Land Sachsen-Anhalt unterstützt und aus Mittel des Europäischen Sozialfonds mitfinanziert."} src={"/images/esf-signetpaar.svg"} />
                            </a>
                        </FooterImageContainer>

                        <NavLink to={"/stats"} className={"no-styled-link"}>
                            <Version>
                                backend: {backend && backend.tag} <br/>
                                frontend: {frontend && frontend.tag}
                            </Version>
                        </NavLink>
                    </div>



                </Row>
                <br/>
            </div>
        </FooterStyled>
    )
};

export {Footer}