import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import Searchbar from "./Searchbar";
import { Button } from "../gui/Button";
import { NavLink, useNavigate } from "react-router-dom";
import Divider from "../gui/Divider";
import { getViewport } from "../../utility/viewport";
import { Icon } from "../gui/_Icon";
import Well from "../gui/Well";
import { Footer } from './Footer';
import { XL_SCREEN, MD_SCREEN } from '../../config/constants';
import ButtonBar from '../gui/ButtonBar';

const Form = styled.div`
  box-sizing: border-box;
  padding: 2rem 3rem;
  margin-top: 4rem;
  background-color: ${props => props.theme.grey_6};
  
  z-index: 1;
      position: relative;
  border-radius: ${props => props.theme.border_radius};
  box-shadow: ${props => props.theme.distant_shadow};

  ${XL_SCREEN} {
      margin: 4rem 15% 0 15%;
  }
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
  border: 2px solid ${props => props.theme.grey_4};
  border-radius: ${props => props.theme.border_radius};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BigLogo = styled.img`
  width: 80%;

  ${MD_SCREEN} {
      width: 300px;
  }
`;

const IllustrationContainer = styled.div`
  min-height: 20vh;
  text-align: center;
  img {
    /* max-height: 20vh; */
    width: 80%;
  }
`

const Wrapper = styled.div`
  position: relative;

  .key-visual {
      position: absolute;
      top: -50px; left: 0; right: 0;

      &:after {
        background: rgb(255,255,255);
        background: linear-gradient(0deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%);
        content: "";
        top: 0; left: 0; right: 0;
        position: absolute;
        width: 100%;
        height: 100%;
      }
  }

  .bg-overlay {
      padding-top: 2rem;
        position: relative;
    background-color: ${props => props.theme.grey_6};
  }
`

const layout = "col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 vertical-center-wrapper align-center";

const Landing = () => {
    const t = useTranslation().t;
    const navigate = useNavigate();
    const videoPlayer = useRef();
    const signedUp = useSelector(state => state.user.logged_in);

    const [showMore, setShowMore] = useState(false);
    const [allowPlayer, setAllowPlayer] = useState(false);

    return (
        <Wrapper>
            <div className={'key-visual'}>
                <img src={'/images/key.jpg'} />
            </div>

            <div className={"row"}>
                <div className={"col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 vertical-center-wrapper align-center"}>
                    <Form>
                        <div>
                            <BigLogo src={"/images/logo.svg"} alt={"tapic Logo"} /><br />
                            <small>Taktile Medien für sehbehinderte Menschen</small>
                        </div>
                        <br />
                        <Searchbar />
                        <br />
                        <ButtonBar align={'center'}>
                            <Button label={"catalogue:grub"} icon={'book-open'} onClick={() => {
                                navigate("/catalogue");
                            }} />
                                <Button label={'catalogue:create'} icon={'pen'} onClick={() => {
                                navigate("/editor/splash");
                            }} />
                        </ButtonBar>
                    </Form>

                </div>
            </div>
            <div className={"row extra-padding"}>
                <p id={"to-jump"} style={{ textAlign: "center", width: "100%" }}>
                    <a href={"#after-jump"} className={'no-styled-link'}>
                        <Button label={'Mehr erfahren'}
                            icon={'arrow-down'} />
                    </a>
                </p>
            </div>

            <div className={'bg-overlay'}>
                <div className={'container'}>
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
                            {showMore ?
                                <>
                                    <p>Nachdem Sie ihre Tastgrafik entworfen haben, können Sie diese über unseren Druckservice
                                    in
                                    Auftrag geben oder den Entwurf herunterladen und mit geeigneten Geräten selbst
                                produzieren</p>
                                    <p>Wenn Sie über unseren Druckservice bestellen, werden die Grafiken auf Schwellpapier
                                    gedruckt
                                    und anschließend angeschwellt, sodass ein buntes Relief entsteht, welches sowohl taktil
                                    als
                                    auch visuell erfasst werden kann. Auf diese Weise schlagen Sie eine Brücke zwischen
                                    sehenden
                                und sehbeeinträchtigten Menschen.</p>
                                    <p>Wir befinden uns noch in der Testphase, daher steht Ihnen der Editor kostenlos zur
                                    Verfügung.
                                    Ebenfalls haben Sie momentan die Möglichkeit die Entwürfe für die eigenhändige
                                    Produktion
                                    gratis herunterzuladen. Unser Ziel ist es zunächst mithilfe der Community den
                                    Onlinekatalog
                                    mit Grafikvorlagen zu befüllen und den Service für Sie zu perfektionieren. In einem
                                    nächsten
                                    Schritt wird es dann erforderlich sein, Lizenzen für die Freischaltung der
                                    Downloadfunktion
                                    zu erwerben. Der Editor wird Ihnen dauerhaft kostenlos zu Verfügung stehen. Mehr
                                Informationen zum Lizenzmodell erhalten sie hier.</p>
                                </>
                                :
                                <Button className={'extra-margin single'} label={"Weiter lesen"} onClick={() => setShowMore(true)} />
                            }
                        </div>

                        <div className={"col-xs-12 col-sm-6"}>
                            <Video ref={videoPlayer} onLoadStart={() => videoPlayer.current.volume = 0.35}
                                src={"images/konzept_tacpic.mp4"} controls={true} poster={"images/thumbnail.jpg"} />
                            {/*<iframe src="https://player.vimeo.com/video/330785558?byline=0"*/}
                            {/*        width={640} height={320} frameBorder="0"*/}
                            {/*        allow="autoplay; fullscreen" allowFullScreen />*/}
                            <script src="https://player.vimeo.com/api/player.js" />
                        </div>
                    </div>

                    {!signedUp &&
                        <div className={"row extra-padding"}>
                            <Well className={layout}>
                                <p>
                                    Legen Sie Ihr kostenloses tacpic-Konto an um eigene Grafiken zu erstellen und lassen Sie sich
                                    durch
                        unseren Newsletter über die neusten Entwicklungen informieren.</p>
                                <p>
                                    <NavLink className={"no-styled-link"} to={'/signup'}>
                                        <Button icon={"user-plus"} primary>
                                            {t("general:signup")}
                                        </Button>
                                    </NavLink>
                                </p>
                            </Well>
                        </div>
                    }

                    <div className={"row extra-padding"}>
                        <div className={"col-xs-12 col-sm-4"}>
                            <IllustrationContainer>
                                <img alt={"dekorative Ilustration Entwurf gestalten"} src={"/images/200902_Konzept-02.svg"} />
                            </IllustrationContainer>

                            <h3>1. Grafik gestalten</h3>
                            <p id={'copy-edit_draft'}>Entwerfen Sie Ihre Grafik im tacpic Online-Editor.</p>
                        </div>
                        <div className={"col-xs-12 col-sm-4"}>
                            <IllustrationContainer>
                                <img alt={"dekorative Ilustration Grafik produzieren"} src={"/images/200902_Konzept-03.svg"} />
                            </IllustrationContainer>
                            <h3>2. Produktion</h3>
                            <p>Auf Bestellung produzieren wir Ihren Entwurf als Tastgrafik auf Schwellpapier.</p>
                            <Divider label={"gui:or"} />
                            <p>Sie laden Ihren Entwurf herunter und nutzen ihn für die eigene Produktion.</p>
                        </div>
                        <div className={"col-xs-12 col-sm-4"}>
                            <IllustrationContainer>
                                <img alt={"dekorative Ilustration Grafik versenden"} src={"/images/200902_Konzept-04.svg"} />
                            </IllustrationContainer>
                            <h3>3. Lieferung</h3>
                            <p>Ihre Bestellung wird per Post an Sie versendet.</p>
                        </div>
                    </div>
                    <div style={{ alignItems: 'flex-start' }} className={"row extra-padding"}>
                        <img src={"images/key2.jpg"} alt={""} />
                    </div>
                    <div className={"row"}>
                        <h2 style={{ textAlign: 'center', width: '100%' }}>tacpic bietet</h2>
                    </div>
                    <div className={"row extra-padding"}>
                        <div className={"col-xs-12 col-sm-4 extra-margin"}>
                            <IllustrationContainer><img src={"images/icon_community.svg"} alt="" role="presentation" />
                            </IllustrationContainer>
                            <h3 id="nutzerfreundlich-effizient">Nutzerfreundlich &amp; effizient</h3>
                            <p>Kernstück ist ein nutzerfreundliches Programm, das eine Alternative zu komplexer
                            Grafiksoftware darstellt. Die Bearbeitungsfunktionen nehmen Rücksicht auf die Möglichkeiten
                            und Grenzen des Tastsinns. Die
                            Software leitet durch den gesamten Gestaltungsprozess und bietet zahlreiche
                        Hilfestellungen.</p>

                        </div>
                        <div className={"col-xs-12 col-sm-4 extra-margin"}>
                            <IllustrationContainer><img src={"images/icon_netzwerk.svg"} alt="" role="presentation" />
                            </IllustrationContainer>
                            <h3 id="community">Community</h3>
                            <p>Nach der Gestaltung können die Grafikvorlagen in einem öffentlichen Katalog zugänglich
                            gemacht werden. Andere Nutzende können
                        Verbesserungen nach dem Wiki-Prinzip einpflegen.</p>

                        </div>
                        <div className={"col-xs-12 col-sm-4 extra-margin"}>
                            <IllustrationContainer><img src={"images/icon_guenstig.svg"} alt="" role="presentation" />
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
                        <div className={"col-xs-12 col-md-6"}>
                            {allowPlayer ?
                                <iframe title="vimeo-player" src="https://www.youtube.com/embed/-HUqk2zYi54" width="100%"
                                    height="auto" style={{ height: "15em" }} frameBorder={0} allowFullScreen={true} />
                                :
                                <Placeholder onClick={() => setAllowPlayer(true)}>Inhalte von Youtube laden</Placeholder>
                            }
                            <p style={{ textAlign: "right" }}><small>Film von&nbsp;<a
                                href="https://www.lichtempfindlich.org/">lichtempfindlich</a></small></p>
                        </div>
                    </div>
                </div>

            </div>



            <Footer />
        </Wrapper>
    );
};

export default Landing;