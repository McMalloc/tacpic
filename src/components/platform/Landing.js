import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import Searchbar from "./Searchbar";
import { Button } from "../gui/Button";
import { NavLink, useNavigate } from "react-router-dom";
import Divider from "../gui/Divider";
import Well from "../gui/Well";
import { XL_SCREEN, MD_SCREEN } from '../../config/constants';
import ButtonBar from '../gui/ButtonBar';
import { Trans } from 'react-i18next';

const Form = styled.div`
  box-sizing: border-box;
  padding: 2rem 3rem;
  margin-top: 4rem;
  background-color: ${props => props.theme.grey_6};
  
  /* z-index: 1; */
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
      top: -50px; left: 0; right: 0; bottom: 0;
      background-image: url('/images/key.jpg');

      ${MD_SCREEN} {
          background-size: contain;
      }
      
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

    useEffect(() => {
        document.title = 'tacpic | Start';
        // trackEvent({category: 'page change', action: location.pathname});
    }, []);

    return (
        <Wrapper>
            <div className={'key-visual'} />

            <div className={"row"}>
                <div className={"col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 vertical-center-wrapper align-center"}>
                    <Form>
                        <div>
                            <h1 style={{margin: 0}} aria-label={'tacpic'}><BigLogo src={"/images/logo.svg"} alt={"tapic Logo"} /></h1>
                            <br />
                            <small>{t('claim')}</small>
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
                        <Button label={'landing:learnMore'}
                            icon={'arrow-down'} />
                    </a>
                </p>
            </div>

            <div className={'bg-overlay'}>
                <div className={'container'}>
                    <div className={"row"} id={"after-jump"}>
                        <div className={"col-xs-12 col-sm-6"}>
                            <Trans i18nKey={'landing:copy'}>
                                <h2>h</h2>
                                <p>p</p>
                            </Trans>

                            {showMore ?
                                <Trans i18nKey={'landing:copyAfterJump'}>
                                    <p>p</p>
                                    <p>p</p>
                                    <p>p</p>
                                </Trans>
                                :
                                <Button className={'extra-margin single'} label={"landing:readOn"} onClick={() => setShowMore(true)} />
                            }
                        </div>

                        <div className={"col-xs-12 col-sm-6"}>
                            <Video ref={videoPlayer} onLoadStart={() => videoPlayer.current.volume = 0.20}
                                controls={true} poster={"images/thumbnail.jpg"}>
                                <source src={"images/konzept_tacpic.mp4"} type={"video/mp4"} />
                                <track src={"images/konzept_captions.vtt"} kind={"captions"} srclang={"de"} label={t("landing:germanCaptions")} />
                            </Video>
                        </div>
                    </div>

                    {!signedUp &&
                        <div className={"row extra-padding"}>
                            <Well className={layout}>
                                <p>{t('landing:signUpCTA')}</p>
                                <p>
                                    <NavLink className={"no-styled-link"} to={'/signup'}>
                                        <Button icon={"user-plus"} label={'account:signup'} primary />
                                    </NavLink>
                                </p>
                            </Well>
                        </div>
                    }

                    <div className={"row extra-padding"}>
                        <div className={"col-xs-12 col-sm-4"}>
                            <IllustrationContainer>
                                <img alt={t('landing:step1alt')} src={"/images/gestalten.svg"} />
                            </IllustrationContainer>

                            <h3 className={''}>{t('landing:step1Heading')}</h3>
                            <p id={'copy-edit_draft'}>{t('landing:step1copy')}</p>
                        </div>
                        <div className={"col-xs-12 col-sm-4"}>
                            <IllustrationContainer>
                                <img alt={t('landing:step2alt')} src={"/images/produktion.svg"} />
                            </IllustrationContainer>
                            <h3>{t('landing:step2Heading')}</h3>
                            <p>{t('landing:step2copy')}</p>
                            <Divider label={"or"} />
                            <p>{t('landing:step2copyOr')}</p>
                        </div>
                        <div className={"col-xs-12 col-sm-4"}>
                            <IllustrationContainer>
                                <img alt={t('landing:step3alt')} src={"/images/liefern.svg"} />
                            </IllustrationContainer>
                            <h3>{t('landing:step3Heading')}</h3>
                            <p>{t('landing:step3copy')}</p>
                        </div>
                    </div>
                    <div style={{ alignItems: 'flex-start' }} className={"row extra-padding"}>
                        <img src={"images/key2.jpg"} alt={""} />
                    </div>
                    <div className={"row"}>
                        <h2 style={{ textAlign: 'center', width: '100%' }}>{t('landing:uspHeading')}</h2>
                    </div>
                    <div className={"row extra-padding"}>
                        <div className={"col-xs-12 col-sm-4 extra-margin"}>
                            <IllustrationContainer><img src={"images/icon_community.svg"} alt="" role="presentation" />
                            </IllustrationContainer>
                            <h3 className={'align-center'} id="nutzerfreundlich-effizient">{t('landing:usp1')}</h3>
                            <p>{t('landing:usp1copy')}</p>

                        </div>
                        <div className={"col-xs-12 col-sm-4 extra-margin"}>
                            <IllustrationContainer><img src={"images/icon_netzwerk.svg"} alt="" role="presentation" />
                            </IllustrationContainer>
                            <h3 className={'align-center'} id="community">{t('landing:usp2')}</h3>
                            <p>{t('landing:usp2copy')}</p>

                        </div>
                        <div className={"col-xs-12 col-sm-4 extra-margin"}>
                            <IllustrationContainer><img src={"images/icon_guenstig.svg"} alt="" role="presentation" />
                            </IllustrationContainer>
                            <h3 className={'align-center'} id="individuell-preisg-nstig">{t('landing:usp3')}</h3>
                            <p>{t('landing:usp3copy')}</p>

                        </div>
                    </div>
                    <div className={"row extra-padding"}>
                        <div className={"col-xs-12 col-sm-6"}>
                            <h2>{t('landing:aboutUs')}</h2>
                            <p>{t('landing:aboutUsCopy')}</p>
                        </div>
                        <div className={"col-xs-12 col-md-6"}>
                            {allowPlayer ?
                                <iframe title="vimeo-player" src="https://www.youtube.com/embed/-HUqk2zYi54" width="100%"
                                    height="auto" style={{ height: "15em" }} frameBorder={0} allowFullScreen={true} />
                                :
                                <Placeholder onClick={() => setAllowPlayer(true)}>{t('landing:aboutUsVideoOptin')}</Placeholder>
                            }
                            <p style={{ textAlign: "right" }}><small>
                                <Trans i18nKey={'landing:aboutUsVideocredits'}>
                                    0<a href="https://www.lichtempfindlich.org/">1</a>
                                </Trans>
                            </small></p>
                        </div>
                    </div>
                </div>

            </div>
        </Wrapper>
    );
};

export default Landing;