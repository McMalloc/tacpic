import React from "react";
import {useHistory, useParams, useRouteMatch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {VARIANT, FILE} from "../../actions/constants";
import {Row} from "../gui/Grid";
import styled, {useTheme} from "styled-components";
import {useTranslation} from "react-i18next";
import {Icon} from "../gui/_Icon";
import {TagView} from "./Tag";
import {Alert} from "../gui/Alert";
import {NavLink} from "react-router-dom";
import Carousel from "../gui/Carousel";

const mapFormat = (width, height) => {
    width = parseInt(width);
    height = parseInt(height);
    if (width === 210 && height === 297) return 'a4-portrait';
    if (width === 297 && height === 210) return 'a4-landscape';
    if (width === 297 && height === 420) return 'a3-portrait';
    if (width === 420 && height === 297) return 'a3-landscape';
};

const VariantView = props => {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    const history = useHistory();
    const {t} = useTranslation();
    const theme = useTheme();
    let {graphicId, variantId} = useParams();
    let variant = props.variants.find(variant => variant.id == variantId);
    const dispatch = useDispatch();
    const tags = useSelector(state => state.catalogue.tags);
    const logged_in = useSelector(state => state.user.logged_in);

    if (!variant) return null;

    // TODO Suchbegriff aus Store holen und in Variantenbeschreibung hervorheben

    return (
        <Row>
            <div className={"col-md-6 col-xl-4"}>
                <Carousel>
                    {variant.document.pages.map((page, index) => {
                        if (page.text) {
                            // TODO ordentliche Komponente; wie kann die Größe garantiert werden?
                            return <div style={{backgroundColor: 'white', padding: 6}}>{page.content}</div>
                        } else {
                            return <img src={`http://localhost:9292/thumbnails/${graphicId}-${variantId}-${index}-xl.png`}/>
                        }
                    })}
                </Carousel>
            </div>
            <div className={"col-md-6 col-xl-8 xs-first"}>
                <h2>{variant.title}</h2>
                <p>{variant.description}</p>

                <p>
                    <Icon title={"Abmessungen oder Format"}
                          icon={"expand-alt"}/> {t('catalogue:' + mapFormat(variant.width, variant.height))}
                    <small>({variant.width}&#8202;cm&#8200;&times;&#8200;{variant.height}&#8202;cm)</small>
                    <br/>
                    <Icon title={"Braille-System"}
                          icon={"braille"}/> {t('catalogue:' + variant.system)} {/*TODO: mapping, kann auch für die select box genutzt werden*/}
                </p>

                <p>
                    {tags.map((tag) => {
                        if (variant.tags.includes(tag.tag_id)) {
                            return <TagView style={{fontSize: '100%'}} theme={theme}
                                            key={tag.tag_id}>{tag.name}</TagView>
                        } else return null;
                    })}
                </p>

                <hr/>

                {!logged_in &&
                <Alert info>
                    Bitte <NavLink to={'/login'}>logge dich ein</NavLink> oder <NavLink to={'/signup'}>erstelle ein
                    Konto</NavLink>, um Grafiken zu bearbeiten.
                </Alert>
                }

                <div style={{margin: '0 15%'}}>
                    <Button className={'extra-margin'}
                            disabled={!logged_in}
                            fullWidth
                            icon={'pen'} onClick={() => {
                        history.push(`/editor/${graphicId}/variants/${variantId}`);
                        dispatch({
                            type: FILE.OPEN.REQUEST,
                            id: variant.id, mode: "edit"
                        })
                    }}>Bearbeiten</Button>


                    <Button className={'extra-margin'}
                            disabled={!logged_in}
                            fullWidth icon={'copy'}
                            onClick={() => {
                                history.push(`/editor/${graphicId}`);
                                dispatch({
                                    type: FILE.OPEN.REQUEST,
                                    id: variant.id, mode: "new"
                                })
                            }}>Neue Variante aus dieser</Button>

                    <Button fullWidth icon={'download'} onClick={() => {
                        window.location = 'http://localhost:9292/variants/' + variantId + '/pdf';
                    }}>Herunterladen</Button>
                </div>
            </div>


        </Row>
    );
};

export default VariantView;