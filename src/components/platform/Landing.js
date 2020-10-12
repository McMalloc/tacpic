import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from "react-redux";
import styled from "styled-components/macro";
import Searchbar from "./Searchbar";
import {Button} from "../gui/Button";
import {useNavigate} from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import {FILE} from "../../actions/action_constants";
import {Row} from "../gui/Grid";
import Divider from "../gui/Divider";
import {getViewport} from "../../utility/viewport";
import {Icon} from "../gui/_Icon";

const Form = styled.div`
  //width: 500px;
  box-sizing: border-box;
  //max-width: 100%;
  padding: ${props => props.theme.large_padding};
`;

const Jump = styled.div`
  position: absolute;
  top: ${props => props.offset}px;
`;

const Wrapper = styled.div`
  position: relative;
`;

const BigLogo = styled.img`
  width: 300px;
  margin: 10vh 0 5vh 0;
`;

const IllustrationContainer = styled.div`
  min-height: 20vh;
  text-align: center;
  padding-top: ${props => props.offset}px;
  padding-bottom: ${props => 36 - props.offset}px;
  img {
    max-height: 20vh;
    width: 70%;
  }
`

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 vertical-center-wrapper align-center";

const Landing = () => {
    const t = useTranslation().t;
    const navigate = useNavigate();

    const [offset, setOffset] = useState(null);

    useEffect(() => {
        document.getElementById("app-container") && setOffset(document.getElementById("app-container").getBoundingClientRect().height)
    })

    return (
        <Wrapper>
            <Row>
                <br />
                <div className={layout}>
                    <Form>
                        <div>
                            <BigLogo src={"/images/logo.svg"} alt={"tapic Logo"}/>
                        </div>
                        <Searchbar/>
                        <br/><br/><br/>
                        <div style={{marginBottom: "10vh"}}>
                            <Button onClick={() => {
                                navigate("/catalogue");
                            }}>{t("catalogue:grub")}</Button>&ensp;
                            <Button onClick={() => {
                                navigate("/editor/new");
                            }}>{t("catalogue:create")}</Button>
                        </div>
                    </Form>
                </div>
            </Row>
            <Row>
                <p style={{textAlign: "center", width: "100%"}}>
                    <a href={"#after-jump"}>Mehr erfahren<br /><Icon icon={"arrow-down"} /> </a>
                </p>
            </Row>
            {offset &&
            <Jump id={"after-jump"} offset={offset}>
                <Row style={{justifyContent: "center"}}>
                        <iframe src="https://player.vimeo.com/video/330785558?byline=0"
                                width={640} height={320} frameBorder="0"
                                allow="autoplay; fullscreen" allowFullScreen />
                    <script src="https://player.vimeo.com/api/player.js" />
                </Row>
                <Row>
                    <div className={"col-md-4"}>
                        <IllustrationContainer offset={0}>
                            <img src={"/images/200902_Konzept-02.svg"}/>
                        </IllustrationContainer>

                        <h2>1. Grafik gestalten</h2>
                        <p>Entwerfen Sie Ihre Grafik im tacpic Online-Editor.</p>
                    </div>
                    <div className={"col-md-4"}>
                        <IllustrationContainer offset={24}>
                            <img src={"/images/200902_Konzept-03.svg"}/>
                        </IllustrationContainer>
                        <h2>2. Produktion</h2>
                        <p>Auf Bestellung rpoduzieren wir Ihren Entwurf als Tastgrafik auf Schwellpapier.</p>
                        <Divider label={"gui:or"} />
                        <p>Sie laden Ihren Entwurf herunter und nutzen ihn für die eigene Produktion.</p>
                    </div>
                    <div className={"col-md-4"}>
                        <IllustrationContainer offset={36}>
                            <img src={"/images/200902_Konzept-04.svg"}/>
                        </IllustrationContainer>
                        <h2>3. Lieferung</h2>
                        <p>Ihre Bestellung wird per Post an Sie versendet.</p>
                    </div>
                </Row>
            </Jump>
            }
        </Wrapper>

    );
};

export default Landing;