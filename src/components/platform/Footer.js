import styled, {useTheme} from 'styled-components/macro';
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
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
   }
   
   .heading {
      text-transform: uppercase;
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
  opacity: 0.8;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 90%;
  //align-self: center;
  right: 10px;
  //background-color: red;
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
    const {backend, frontend} = useSelector(
        state => state.app
    );

    return (
        <FooterStyled>
            <div className={"container"}>
                <Row>
                    <div className={"col-md-3 col-md-offset-9"}>
                        <NavLink to={"/stats"} className={"no-styled-link"}>
                            <Version>
                                backend: {backend && backend.tag} <br/>
                                frontend: {frontend && frontend.tag}
                            </Version>
                        </NavLink>
                    </div>
                </Row>
                <Row>
                    <div className={"col-md-4"}>
                        <p>
                            <div className={"heading"}>Rechtliches</div>
                            <a href={"https://www.tacpic.de/impressum.html"}>Impressum</a> <br/>
                            <NavLink to={"/agb"}>Allgemeine Geschäftsbedingungen</NavLink> <br/>
                            <NavLink to={"/datenschutz"}>Datenschutzerklärung</NavLink> <br/>
                        </p>

                        <p>

                        </p>
                    </div>
                    <div className={"col-md-5"}>
                        <p>
                            <div className={"heading"}>Kontakt</div>
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
                    <div className={"col-md-3"}>
                        <div aria-hidden={true} className={"heading"}>&ensp;</div>
                        <img src={"/images/logo_dark.svg"} />

                        <FooterImageContainer>
                            <a href={"https://europa.sachsen-anhalt.de"}>
                                <img alt={"Das Projekt tacpic wird vom Land Sachsen-Anhalt unterstützt und aus Mittel des Europäischen Sozialfonds mitfinanziert."} src={"/images/esf-signetpaar.svg"} />
                            </a>
                        </FooterImageContainer>
                    </div>



                </Row>
                <br/>
            </div>
        </FooterStyled>
    )
};

export {Footer}