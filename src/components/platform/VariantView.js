import React from "react";
import {useHistory, useParams, useRouteMatch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {VARIANT, FILE} from "../../actions/constants";
import {Row} from "../gui/Grid";
import styled, {useTheme} from "styled-components";

const GraphicView = styled.div`
    img {
      width: 100%;
      height: auto;
    }
    
    border: 1px solid ${props => props.grey_6};
    box-shadow: ${props => props.distant_shadow};
`;

const VariantView = props => {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let {path, url} = useRouteMatch();
    const history = useHistory();
    const theme = useTheme();
    let {graphicId, variantId} = useParams();
    let variant = props.variants.find(variant => variant.id == variantId);
    const dispatch = useDispatch();
    const tags = useSelector(
        state => state.catalogue.tags
    );

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

                <p>DIN A4 <small>({variant.width}&#8202;cm&#8200;&times;&#8200;{variant.height}&#8202;cm)</small><br/>
                    Deutsch Kurzschrift {/*TODO: mapping, kann auch für die select box genutzt werden*/}
                </p>
                <hr/>

                <Button icon={'pen'} onClick={() => {
                    history.push(`/editor/${graphicId}/variants/${variantId}`);
                    dispatch({
                        type: FILE.OPEN.REQUEST,
                        id: variant.id, mode: "edit"
                    })
                }}>Bearbeiten</Button>

                <Button icon={'copy'} onClick={() => {
                    history.push(`/editor/${graphicId}`);
                    dispatch({
                        type: FILE.OPEN.REQUEST,
                        id: variant.id, mode: "new"
                    })
                }}>Neue Variante aus dieser</Button>

                <Button icon={'download'} onClick={() => {
                    window.location = 'http://localhost:9292/variants/' + variantId + '/pdf';
                }}>Herunterladen</Button>


                <p>
                    {tags.map((tag) => {
                        if (variant.tags.includes(tag.tag_id)) {
                            return <span style={{padding: 2, margin: 3, border: '1px solid red', borderRadius: 2}}
                                         key={tag.tag_id}>{tag.name}</span>
                        } else return null;
                    })}
                </p>
            </div>


        </Row>
    );
};

export default VariantView;