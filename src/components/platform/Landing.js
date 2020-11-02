import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components/macro";
import Searchbar from "./Searchbar";
import {Button} from "../gui/Button";
import {useNavigate} from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import {FILE} from "../../actions/action_constants";
import Divider from "../gui/Divider";
import {getViewport} from "../../utility/viewport";
import {Icon} from "../gui/_Icon";
import {Container, Row} from "../gui/Grid";
import {Alert} from "../gui/Alert";

const Form = styled.div`
  //width: 500px;
  box-sizing: border-box;
  //max-width: 100%;
  padding: ${props => props.theme.large_padding};
`;

const Video = styled.video`
  max-width: 100%;
  height: auto;
`;

const Placeholder = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 15em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props=>props.theme.grey_4};
  border-radius: ${props=>props.theme.border_radius};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BigLogo = styled.img`
  width: 300px;
`;

const IllustrationContainer = styled.div`
  min-height: 20vh;
  text-align: center;
  padding-top: ${props => props.offset}px;
  padding-bottom: ${props => 36 - props.offset}px;
  img {
    max-height: 20vh;
    width: 60%;
  }
`

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 vertical-center-wrapper align-center";

const Landing = () => {
    const t = useTranslation().t;
    const navigate = useNavigate();
    const videoPlayer = useRef();
    const signedUp = useSelector(state=>state.user.logged_in);

    const [showMore, setShowMore] = useState(true);
    const [allowPlayer, setAllowPlayer] = useState(false);
    const [vheight, setVheight] = useState(false);

    useEffect(() => {
        setVheight(getViewport().vh);
    }, []);

    return (
        <>
            <div style={{height: vheight}}>
                <div className={"row extra-padding"}>
                    <br/>
                    <div className={layout}>
                        <Form>
                            <div style={{margin: "10vh 0 5vh 0"}}>
                                <BigLogo src={"/images/logo.svg"} alt={"tapic Logo"}/><br/>
                                <small>Taktile Medien für sehbehinderte Menschen</small>
                            </div>
                            <Searchbar/>
                            <br/><br/><br/>
                            <div>
                                <Button onClick={() => {
                                    navigate("/catalogue");
                                }}>{t("catalogue:grub")}</Button>&ensp;
                                <Button onClick={() => {
                                    navigate("/editor/new");
                                }}>{t("catalogue:create")}</Button>
                            </div>
                        </Form>
                        {!signedUp &&
                        <>
                            <p> <hr/></p>
                            <p>
                                Legen Sie Ihr kostenloses tacpic-Konto an um eigene Grafiken zu erstellen und lassen Sie sich durch unseren Newsletter über die neusten Entwicklungen informieren.<br />
                                <p>
                                    <Button large icon={"user-plus"} primary>
                                        {t("general:signup")}
                                    </Button>
                                </p>

                            </p>
                            <p> <hr/></p>
                        </>
                        }

                    </div>
                </div>
                <div className={"row extra-padding"}>
                    <p id={"to-jump"} style={{textAlign: "center", width: "100%"}}>
                        <a href={"#after-jump"}>Mehr erfahren<br/><Icon icon={"arrow-down"}/> </a>
                    </p>
                </div>
            </div>

            {showMore &&
            <>
                <div className={"row"} id={"after-jump"}>
                    <div className={"col-xs-12 col-sm-6"}>
                        <h2>Mit unserem tacpic Online-Editor können Sie jetzt schnell und einfach taktile Grafiken
                            online gestalten.</h2>
                        <p>Nachdem Sie ihre Tastgrafik entworfen haben, können Sie diese über unseren Druckservice in
                            Auftrag geben oder den Entwurf herunterladen und mit geeigneten Geräten selbst
                            produzieren</p>
                        <p>Der tacpic Online-Editor ist ein nutzerfreundliches Programm und stellt eine Alternative zu
                            komplexer Grafiksoftware dar. Er wurde als Webanwendung speziell für die Gestaltung von
                            Grafikvorlagen für Tastgrafiken konzipiert.</p>
                        <p>Nachdem Sie ihre Tastgrafik entworfen haben, können Sie diese über unseren Druckservice in
                            Auftrag geben oder den Entwurf herunterladen und mit geeigneten Geräten selbst
                            produzieren</p>
                        <p>Wenn Sie über unseren Druckservice bestellen, werden die Grafiken auf Schwellpapier gedruckt
                            und anschließend angeschwellt, sodass ein buntes Relief entsteht, welches sowohl taktil als
                            auch visuell erfasst werden kann. Auf diese Weise schlagen Sie eine Brücke zwischen sehenden
                            und sehbeeinträchtigten Menschen.</p>
                        <p>Wir befinden uns noch in der Testphase, daher steht Ihnen der Editor kostenlos zur Verfügung.
                            Ebenfalls haben Sie momentan die Möglichkeit die Entwürfe für die eigenhändige Produktion
                            gratis herunterzuladen. Unser Ziel ist es zunächst mithilfe der Community den Onlinekatalog
                            mit Grafikvorlagen zu befüllen und den Service für Sie zu perfektionieren. In einem nächsten
                            Schritt wird es dann erforderlich sein, Lizenzen für die Freischaltung der Downloadfunktion
                            zu erwerben. Der Editor wird Ihnen dauerhaft kostenlos zu Verfügung stehen. Mehr
                            Informationen zum Lizenzmodell erhalten sie hier.</p>
                    </div>

                    <div className={"col-xs-12 col-sm-6"}>
                        <Video ref={videoPlayer} onLoadStart={() => videoPlayer.current.volume = 0.35}
                               src={"images/konzept_tacpic.mp4"} controls={true} poster={"images/thumbnail.jpg"}/>
                        {/*<iframe src="https://player.vimeo.com/video/330785558?byline=0"*/}
                        {/*        width={640} height={320} frameBorder="0"*/}
                        {/*        allow="autoplay; fullscreen" allowFullScreen />*/}
                        <script src="https://player.vimeo.com/api/player.js"/>
                    </div>
                </div>
                <div className={"row extra-padding"}>
                    <div className={"col-xs-12 col-sm-4"}>
                        <IllustrationContainer offset={0}>
                            <img src={"/images/200902_Konzept-02.svg"}/>
                        </IllustrationContainer>

                        <h3>1. Grafik gestalten</h3>
                        <p>Entwerfen Sie Ihre Grafik im tacpic Online-Editor.</p>
                    </div>
                    <div className={"col-xs-12 col-sm-4"}>
                        <IllustrationContainer offset={24}>
                            <img src={"/images/200902_Konzept-03.svg"}/>
                        </IllustrationContainer>
                        <h3>2. Produktion</h3>
                        <p>Auf Bestellung rpoduzieren wir Ihren Entwurf als Tastgrafik auf Schwellpapier.</p>
                        <Divider label={"gui:or"}/>
                        <p>Sie laden Ihren Entwurf herunter und nutzen ihn für die eigene Produktion.</p>
                    </div>
                    <div className={"col-xs-12 col-sm-4"}>
                        <IllustrationContainer offset={36}>
                            <img src={"/images/200902_Konzept-04.svg"}/>
                        </IllustrationContainer>
                        <h3>3. Lieferung</h3>
                        <p>Ihre Bestellung wird per Post an Sie versendet.</p>
                    </div>
                </div>
                <div className={"row extra-padding"}>
                    <img src={"images/key.jpg"} alt={""}/>
                </div>
                <div className={"row extra-padding"}>
                    <h2 style={{textAlign: 'center', width: '100%'}}>tacpic bietet</h2>
                </div>
                <div className={"row extra-padding"}>
                    <div className={"col-xs-12 col-sm-4"}>
                        <IllustrationContainer><img src={"images/icon_community.svg"} alt="" role="presentation"/>
                        </IllustrationContainer>
                        <h3 id="nutzerfreundlich-effizient">Nutzerfreundlich &amp; effizient</h3>
                        <p>Kernstück ist ein nutzerfreundliches Programm, das eine Alternative zu komplexer
                            Grafiksoftware darstellt. Die Bearbeitungsfunktionen nehmen Rücksicht auf die Möglichkeiten
                            und Grenzen des Tastsinns. Die
                            Software leitet durch den gesamten Gestaltungsprozess und bietet zahlreiche
                            Hilfestellungen.</p>

                    </div>
                    <div className={"col-xs-12 col-sm-4"}>
                        <IllustrationContainer><img src={"images/icon_netzwerk.svg"} alt="" role="presentation"/>
                        </IllustrationContainer>
                        <h3 id="community">Community</h3>
                        <p>Nach der Gestaltung können die Grafikvorlagen in einem öffentlichen Katalog zugänglich
                            gemacht werden. Andere Nutzende können
                            Verbesserungen nach dem Wiki-Prinzip einpflegen.</p>

                    </div>
                    <div className={"col-xs-12 col-sm-4"}>
                        <IllustrationContainer><img src={"images/icon_guenstig.svg"} alt="" role="presentation"/>
                        </IllustrationContainer>
                        <h3 id="individuell-preisg-nstig">Individuell &amp; preisgünstig</h3>
                        <p>Tacpic macht es möglich, individuelle Grafiken für Privatpersonen auf kostengünstige Weise
                            umzusetzen. Profitieren können vor allem sehbehinderte Schülerinnen und Schüler in
                            Inklusionsklassen, deren Unterrichtsmaterial speziell auf ihre Bedürfnisse angepasst werden
                            muss.</p>

                    </div>
                </div>
                <div className={"row extra-padding"}>
                    <div className={"col-xs-12 col-sm-6"}>
                        <h2>Über Uns</h2><p>Entstanden ist die Idee im Rahmen eines Semesterprojektes unter Leitung von
                        Prof. Dominik Schumacher im Master-Studiengang Interaction Design an der Hochschule
                        Magdeburg-Stendal.
                        Nach dem erfolgreichen Studienabschluss gründeten die Absolventen Laura Evers, Florentin
                        Förschler und Robert Wlcek tacpic, um einer breiten Öffentlichkeit die Möglichkeit zu geben,
                        taktile Grafiken zu gestalten und zugänglich zu machen.</p>
                        {/*<p><a href="mailto:kontakt@tacpic.de?subject=Bitte eigenen Betreff einsetzen">Schreiben Sie*/}
                        {/*    uns!</a></p>*/}
                    </div>
                    <div className={"col-md-6"}>
                        {allowPlayer ?
                            <iframe title="vimeo-player" src="https://www.youtube.com/embed/-HUqk2zYi54" width="100%"
                                    height="auto" style={{height: "15em"}} frameBorder={0} allowFullScreen={true}/>
                                    :
                            <Placeholder onClick={() => setAllowPlayer(true)}>Inhalte von Youtube laden</Placeholder>
                        }
                        <p style={{textAlign: "right"}}><small>Film von&nbsp;<a
                            href="https://www.lichtempfindlich.org/">lichtempfindlich</a></small></p>
                    </div>
                </div>
            </>
            }
        </>

    );
};

export default Landing;