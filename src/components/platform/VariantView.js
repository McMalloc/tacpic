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

const GraphicView = styled.div`
    img {
      width: 100%;
      height: auto;
    }
    
    border: 1px solid ${props => props.grey_6};
    box-shadow: ${props => props.distant_shadow};
`;

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
    const tags = useSelector(
        state => state.catalogue.tags
    );

    if (!variant) return null;

    // TODO Suchbegriff aus Store holen und in Variantenbeschreibung hervorheben

    return (
        <Row>
            <div className={"col-md-6 col-xl-4 col-xs-12"}>
                <GraphicView {...theme}>
                    <img src={"http://localhost:9292/static/thumbnails/thumbnail-" + variantId + "-xl.png"}/>
                </GraphicView>

            </div>
            <div className={"col-md-6 col-xl-8 col-xs-12 xs-first"}>
                <h2>{variant.title}</h2>
                <p>{variant.description}</p>

                <p>
                    <Icon title={"Abmessungen oder Format"} icon={"expand-alt"}/> {t('catalogue:' + mapFormat(variant.width, variant.height))} <small>({variant.width}&#8202;cm&#8200;&times;&#8200;{variant.height}&#8202;cm)</small>
                    <br/>
                    <Icon title={"Braille-System"} icon={"braille"}/> {t('catalogue:' + variant.system)} {/*TODO: mapping, kann auch für die select box genutzt werden*/}
                </p>

                <p>
                    {tags.map((tag) => {
                        if (variant.tags.includes(tag.tag_id)) {
                            return <TagView style={{fontSize: '100%'}} theme={theme} key={tag.tag_id}>{tag.name}</TagView>
                        } else return null;
                    })}
                </p>

                <hr/>

                <div style={{margin: '0 15%'}}>
                    <Button className={'extra-margin'} fullWidth icon={'pen'} onClick={() => {
                        history.push(`/editor/${graphicId}/variants/${variantId}`);
                        dispatch({
                            type: FILE.OPEN.REQUEST,
                            id: variant.id, mode: "edit"
                        })
                    }}>Bearbeiten</Button>


                    <Button className={'extra-margin'} fullWidth icon={'copy'} onClick={() => {
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