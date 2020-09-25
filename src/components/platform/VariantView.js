import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Button, FlyoutButton, FlyoutEntry} from "../gui/Button";
import {FILE, ITEM_ADDED_TO_BASKET} from "../../actions/action_constants";
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
import {Numberinput} from "../gui/Input";
import {Currency} from "../gui/Currency";
import {template} from "lodash";
import * as moment from 'moment'
import {APP_URL, API_URL} from "../../env.json";
import Well from "../gui/Well";
import More from "../gui/More";
import Label from "../gui/_Label";

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
  padding-bottom: 12px;
  //justify-content: space-between;
`;

const OrderWidget = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  
  &>* {
    flex: 1 1 auto;
    &:last-child {
      margin-top: 6px;
    }
  }
`;

const VariantView = props => {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    const navigate = useNavigate();
    const {t} = useTranslation();
    const theme = useTheme();
    let {graphicId, variantId} = useParams();
    const dispatch = useDispatch();
    const tags = useSelector(state => state.catalogue.tags);
    const logged_in = useSelector(state => state.user.logged_in);
    const [product, setProduct] = useState('graphic');
    const [quantity, setQuantity] = useState(1);
    // TODO Suchbegriff aus Store holen und in Variantenbeschreibung hervorheben

    if (!props.id) return null;
    return (
        <Row style={{height: '100%'}}>
            <div className={"col-md-6 col-lg-5 col-xl-3"}>
                <Carousel single={<span className={'disabled'}>Insgesamt eine Grafikseite.</span>}>
                    {props.document.pages.map((page, index) => {
                        return <img key={index} src={`${API_URL}/thumbnails/${props.file_name}-THUMBNAIL-xl-p${index}.png`}/>
                    }).filter(item => item !== null)}
                    {/*TODO formatierer existiert so auch in einer saga, kann refaktorisiert werden*/}
                    <div style={{backgroundColor: 'white', padding: 6}}>{
                        Object.keys(props.document.braillePages.imageDescription)
                            .reduce((accumulator, blockKey) => accumulator + props.document.braillePages.imageDescription[blockKey] + "\n\n", "")
                        + props.document.braillePages.content
                    }</div>
                </Carousel>
            </div>
            <Details className={"col-md-6 col-lg-7 col-xl-9 xs-first"}>
                <div>
                    <h2>{props.graphicTitle}: {props.title}</h2>
                    <More><p>{props.description}</p></More>
                    <p><small>Erstellt am {moment(props.created_at).format("DD.MM.YYYY, HH:mm")} Uhr</small></p>
                </div>
                <div>
                    <br/>
                    <table>
                        <tbody>
                        <tr>
                            <td className={"icon-cell"}><Icon title={"Format der Grafikseiten"}
                                                              icon={"file-image"}/></td>
                            <td>Grafikseiten</td>
                            <td className={"important"}>
                                {props.graphic_no_of_pages} {props.graphic_no_of_pages === 1 ? 'Seite' : 'Seiten'} {t(`catalogue:${props.graphic_format}-${props.graphic_landscape ? 'landscape' : 'portrait'}`)}
                            </td>
                        </tr>
                        <tr>
                            <td className={"icon-cell"}><Icon title={"Format der Brailleseiten"}
                                                              icon={"braille"}/></td>
                            <td>Brailleseiten</td>
                            <td className={"important"}>
                                {props.braille_no_of_pages} {props.braille_no_of_pages === 1 ? 'Seite' : 'Seiten'} {t(`catalogue:${props.braille_format}-portrait`)}
                            </td>
                        </tr>
                        <tr>
                            <td className={"icon-cell"}>&ensp;</td>
                            <td>Braillesystem:</td>
                            <td className={"important"}>{t('catalogue:' + props.system)}
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            {props.tags.length && props.tags.length > 0 ?
                                <>
                                    <td>Schlagworte:</td>
                                    <td>{tags.map((tag) => {
                                        if (props.tags.includes(tag.tag_id)) {
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
                        </tbody>
                    </table>
                    <br />

                    {!logged_in &&
                    <Alert info>
                        Bitte <NavLink to={'/login'}>logge dich ein</NavLink> oder <NavLink to={'/signup'}>erstelle ein
                        Konto</NavLink>, um Grafiken zu bearbeiten.
                    </Alert>
                    }

                    <Toolbar columns={2}>
                        <FlyoutButton flyoutWidth={300} disabled={!logged_in} rightAlign icon={'pen'} label={"Im Editor öffnen, um ..."}>
                            <FlyoutEntry icon={"file-medical"}
                                         label={"catalogue:variant-copy"}
                                         onClick={() => navigate(`/editor/${graphicId}/variant/${variantId}/copy`)}
                                         sublabel={"catalogue:variant-copy-hint"} />
                            <FlyoutEntry icon={"glasses"}
                                         label={"catalogue:variant-edit"}
                                         onClick={() => navigate(`/editor/${graphicId}/variant/${variantId}/edit`)}
                                         sublabel={"catalogue:variant-edit-hint"} />
                            <FlyoutEntry icon={"file-export"}
                                         label={"catalogue:variant-new"}
                                         onClick={() => navigate(`/editor/copy`)}
                                         sublabel={"catalogue:variant-new-hint"} />
                        </FlyoutButton>

                        <FlyoutButton disabled={!logged_in} rightAlign icon={'file-download'} label={"Herunterladen als ..."}>
                            <FlyoutEntry icon={"file-pdf"}
                                         label={"catalogue:pdf"}
                                         onClick={() => window.location = `${APP_URL}/variants/${variantId}/pdf`}
                                         sublabel={"catalogue:pdf-hint"} />
                            <FlyoutEntry icon={"file-word"}
                                         label={"catalogue:rtf"}
                                         onClick={() => window.location = `${APP_URL}/variants/${variantId}/rtf`}
                                         sublabel={"catalogue:rtf-hint"} />
                            <FlyoutEntry icon={"file"}
                                         label={"catalogue:brf"}
                                         onClick={() => window.location = `${APP_URL}/variants/${variantId}/brf`}
                                         sublabel={"catalogue:brf-hint"} />
                        </FlyoutButton>
                    </Toolbar>
                    <br/>
                    <Well>
                        <h3>Bestellen</h3>
                        <Radio onChange={setProduct} value={product} name={"graphic_only_or_both"} options={[
                            {
                                label: template(t(`catalogue:graphics_and_braille`))({amount: props.braille_no_of_pages + props.graphic_no_of_pages}),
                                value: "graphic"
                            },
                            {
                                label: template(t(`catalogue:graphics_only`))({amount: props.graphic_no_of_pages}) + ` - ${((props.quote - props.quote_graphics_only) / 100).toFixed(2).replace('.', ',')} €)`,
                                value: "graphic_nobraille"
                            }]}>
                        </Radio>

                        <br/>

                        <OrderWidget>
                            {/*<div style={{display: 'flex'}}>*/}
                            <Numberinput
                                // disabled={}
                                inline noMargin
                                onChange={event => {
                                    setQuantity(event.currentTarget.value)
                                }}
                                min={1}
                                value={quantity}
                                label={t(`catalogue:Stück`)}/>

                            <div>
                                <Currency
                                    amount={(product === 'graphic' ? props.quote : props.quote_graphics_only) * quantity}/>

                                {/*{quantity !== 1 &&*/}
                                <small><br/>Einzelpreis: <Currency normal
                                    amount={(product === 'graphic' ? props.quote : props.quote_graphics_only)}/>
                                </small>
                                {/*}*/}
                                <small><br/>{t("zzgl. Versand")}</small>
                            </div>

                            <Button
                                onClick={() => addToBasket(dispatch, variantId, quantity, product)}
                                label={t("catalogue:In den Warenkorb")}
                                large primary icon={"cart-plus"}/>
                        </OrderWidget>

                    </Well>
                </div>
            </Details>
        </Row>
    );
};

export default VariantView;