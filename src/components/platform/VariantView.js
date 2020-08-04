import React, {useState} from "react";
import {useHistory, useParams, useRouteMatch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {VARIANT, FILE, GRAPHIC, ITEM_ADDED_TO_BASKET} from "../../actions/action_constants";
import {Row} from "../gui/Grid";
import styled, {useTheme} from "styled-components";
import {useTranslation} from "react-i18next";
import {Icon} from "../gui/_Icon";
import {TagView} from "./Tag";
import {Alert} from "../gui/Alert";
import {NavLink} from "react-router-dom";
import Carousel from "../gui/Carousel";
import Toolbar from "../gui/Toolbar";
import {Radio} from "../gui/Radio";
import Select from "../gui/Select";
import {Numberinput} from "../gui/Input";
import {Currency} from "../gui/Currency";
import {template} from "lodash";
import * as moment from 'moment'
import {API_URL} from "../../env.json";

const mapFormat = (width, height) => {
    width = parseInt(width);
    height = parseInt(height);
    if (width === 210 && height === 297) return 'a4-portrait';
    if (width === 297 && height === 210) return 'a4-landscape';
    if (width === 297 && height === 420) return 'a3-portrait';
    if (width === 420 && height === 297) return 'a3-landscape';
};

const addToBasket = (dispatch, variantId, quantity, product, index = null) => {
    dispatch({
        type: ITEM_ADDED_TO_BASKET,
        productId: product,
        contentId: parseInt(variantId),
        quantity: parseInt(quantity),
        index
    })
}

const Details = styled.div`
  display: flex;
  flex-direction: column;
  //justify-content: space-between;
`;

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
    const [product, setProduct] = useState('graphic');
    const [quantity, setQuantity] = useState(1);

    if (!variant) return null;

    // TODO Suchbegriff aus Store holen und in Variantenbeschreibung hervorheben

    return (
        <Row style={{height: '100%'}}>
            <div className={"col-md-6 col-xl-4"}>
                <Carousel>
                    {variant.document.pages.map((page, index) => {
                        if (page.text) {
                            // TODO ordentliche Komponente; wie kann die Größe garantiert werden?
                            return <div style={{backgroundColor: 'white', padding: 6}}>{page.content}</div>
                        } else {
                            return <img
                                src={`${API_URL}/thumbnails/${variant.file_name}-THUMBNAIL-xl-p${index}.png`}/>
                        }
                    })}
                </Carousel>
            </div>
            <Details className={"col-md-6 col-xl-8 xs-first"}>
                <div>
                    <h2>{variant.title}</h2>
                    <p>{variant.description}</p>
                    <p><small>Erstellt am {moment(variant.created_at).format("DD.MM.YYYY, HH:mm")} Uhr</small></p>
                </div>
                <div>
                    <p>
                        <table>
                            <tr>
                                <td className={"icon-cell"}><Icon title={"Format der Grafikseiten"}
                                                                  icon={"file-image"}/></td>
                                <td>Grafikseiten</td>
                                <td className={"important"}>
                                    {variant.graphic_no_of_pages} {variant.graphic_no_of_pages === 1 ? 'Seite' : 'Seiten'} {t(`catalogue:${variant.graphic_format}-${variant.graphic_landscape ? 'landscape' : 'portrait'}`)}
                                </td>
                            </tr>
                            <tr>
                                <td className={"icon-cell"}><Icon title={"Format der Brailleseiten"}
                                                                  icon={"braille"}/></td>
                                <td>Brailleseiten</td>
                                <td className={"important"}>
                                    {variant.braille_no_of_pages} {variant.braille_no_of_pages === 1 ? 'Seite' : 'Seiten'} {t(`catalogue:${variant.braille_format}-portrait`)}
                                </td>
                            </tr>
                            <tr>
                                <td className={"icon-cell"}>&ensp;</td>
                                <td>Braillesystem:</td>
                                <td className={"important"}>{t('catalogue:' + variant.system)}
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                {variant.tags.length && variant.tags.length > 0 ?
                                    <>
                                        <td>Schlagworte:</td>
                                        <td>{tags.map((tag) => {
                                            if (variant.tags.includes(tag.tag_id)) {
                                                return <TagView style={{fontSize: '100%'}} theme={theme}
                                                                key={tag.tag_id}>{tag.name}</TagView>
                                            } else return null;
                                        })}
                                        </td>
                                    </>
                                    :
                                    <td className={"disabled"} colSpan={2}>Keine Schlagworte für diese Variante.</td>
                                }
                            </tr>
                        </table>
                    </p>

                    {!logged_in &&
                    <Alert info>
                        Bitte <NavLink to={'/login'}>logge dich ein</NavLink> oder <NavLink to={'/signup'}>erstelle ein
                        Konto</NavLink>, um Grafiken zu bearbeiten.
                    </Alert>
                    }

                    <Toolbar columns={2}>
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

                        <Button fullWidth icon={'download'} onClick={() => {
                            window.location = `${API_URL}/variants/${variantId}/pdf`;
                        }}>PDF herunterladen</Button>

                        {props.variants.length < 2 &&
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
                        }


                        <Button fullWidth icon={'download'} onClick={() => {
                            window.location = `${API_URL}/variants/${variantId}/brf`;
                        }}>Brailletext herunterladen</Button>

                    </Toolbar>

                    <hr />

                    <p>
                        <h3>Bestellen</h3>
                        <Radio onChange={setProduct} value={product} name={"graphic_only_or_both"} options={[
                            {label: template(t(`catalogue:graphics_and_braille`))({amount: variant.braille_no_of_pages + variant.graphic_no_of_pages}), value: "graphic"},
                            {label: template(t(`catalogue:graphics_only`))({amount: variant.graphic_no_of_pages}) + ` - ${((variant.quote - variant.quote_graphics_only) / 100).toFixed(2).replace('.', ',')} €)`, value: "graphic_nobraille"}]}>
                        </Radio>

                        <br />

                        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                        {/*<div style={{display: 'flex'}}>*/}
                            <Numberinput
                                // disabled={}
                                inline noMargin
                                onChange={event => {
                                    setQuantity(event.currentTarget.value)
                                }}
                                value={quantity}
                                label={t(`catalogue:Stück`)}/>

                                <div>
                                    <Currency amount={(product === 'graphic' ? variant.quote : variant.quote_graphics_only) * quantity} />

                                    {quantity !== 1 &&
                                    <small><br />Einzelpreis: <Currency amount={(product === 'graphic' ? variant.quote : variant.quote_graphics_only)} />
                                    </small>
                                    }
                                    <small><br/>{t("zzgl. Versand")}</small>
                                </div>


                            <Button
                                onClick={() => addToBasket(dispatch, variantId, quantity, product)}
                                label={t("catalogue:In den Warenkorb")}
                                large primary icon={"cart-plus"}/>
                        </div>

                    </p>
                </div>
            </Details>


        </Row>
    );
};

export default VariantView;