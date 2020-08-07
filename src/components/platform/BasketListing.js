import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import AddressForm from "./AddressForm";
import {ITEM_ADDED_TO_BASKET, ITEM_REMOVED_FROM_BASKET, ORDER, VARIANTS} from "../../actions/action_constants";
import {useDispatch, useSelector} from "react-redux";
import {Currency} from "../gui/Currency";
import {Numberinput} from "../gui/Input";
import {Radio} from "../gui/Radio";
import {Button} from "../gui/Button";
import {Link} from "react-router-dom";
import styled from 'styled-components/macro';
import Tile from "../gui/_Tile";
import CenterWrapper from "../gui/_CenterWrapper";
import {API_URL} from "../../env.json";
import {Alert} from "../gui/Alert";
// import {CSSTransition} from "react-transition-group";

const updateBasket = (dispatch, variantId, quantity, product, index) => {
    dispatch({
        type: ITEM_ADDED_TO_BASKET,
        productId: product,
        contentId: parseInt(variantId),
        quantity: parseInt(quantity),
        index
    })
}

const removeItem = (dispatch, index) => {
    dispatch({
        type: ITEM_REMOVED_FROM_BASKET,
        index
    })
}

const ItemPanel = styled.div`
  margin-bottom: 12px;
  padding: 12px;
  border-radius: ${props=>props.theme.border_radius};
  border: 1px solid ${props => props.theme.grey_4};
  background-color: ${props=>props.theme.background};
  //box-shadow: ${props => props.theme.middle_shadow};

  .upper {
    display: flex;
    
    .left {
      flex: 1 1 30%;
      height: 100px;
       img {
            box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
          }
    }
    .right {
      flex: 2 1 70%;
    }
  }
  .lower {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

const MetaItemTable = styled.table`
  td {
    border: none;
  }
  
  .overline {
    border-top: 2px solid ${props => props.theme.grey_4};
  }
`

const MetaItemRow = styled.tr`
  text-align: right;
  &:last-child {
    font-weight: bold;
   
    td:last-child {
      font-size: 150%;
      text-decoration: underline;
      color: ${props => props.theme.brand_secondary};
    }
  }
`;
const PriceCell = styled.td`
  text-align: right;
  min-width: min-content;
  width: 200px;
`;

const BasketListing = () => {
    const {t} = useTranslation();
    const basket = useSelector(state => state.catalogue.basket);
    const quote = useSelector(state => state.catalogue.quote);
    const quotedVariants = useSelector(state => state.catalogue.quotedVariants);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: ORDER.QUOTE.REQUEST,
            payload: {items: basket}
        })
    }, [basket]);

    useEffect(() => {
        dispatch({
            type: VARIANTS.GET.REQUEST,
            payload: {
                ids: basket.map(item => item.contentId)
            }
        })
    }, [basket]);

    if (quote.items.length === 0) return null;

    return (
        <>
            {quote.items.map((quoteItem, index) => {
                const correspondingVariant = quotedVariants.find(v => v.id === quoteItem.content_id);
                if (!correspondingVariant) return null
                return (
                    // <CSSTransition in={quote.items} timeout={200} classNames={'item'}>
                        <ItemPanel>
                            <div className={'upper'}>
                                <div className={'left'}>
                                    <img style={{height: '70px', width: 'auto'}}
                                         src={`${API_URL}/thumbnails/${correspondingVariant.file_name}-THUMBNAIL-sm-p0.png`}/>
                                </div>
                                <div className={'right'}>
                                    <Link
                                        to={`/catalogue/${correspondingVariant.graphic_id}/variant/${correspondingVariant.id}`}>
                                        <strong>{correspondingVariant.graphic_title} ({correspondingVariant.title})</strong>
                                    </Link>
                                    <p>
                                        {correspondingVariant.graphics_no_of_pages} {correspondingVariant.graphic_format} Grafik,&ensp;
                                        {correspondingVariant.system}
                                    </p>

                                </div>
                            </div>
                            <div className={'middle'}>
                                <Radio
                                    onChange={value => updateBasket(dispatch, quoteItem.content_id, quoteItem.quantity, value, index)}
                                    name={"product_type_" + index}
                                    value={quoteItem.product_id} options={[
                                    {
                                        label: `mit Bildbeschreibung als Brailleprägung (${correspondingVariant.braille_no_of_pages} Seiten)`,
                                        value: "graphic"
                                    },
                                    {label: "Bildbeschreibung nur in E-Mail", value: "graphic_nobraille"}
                                ]}/>
                            </div>
                            <div className={'lower'}>
                                <Button onClick={() => removeItem(dispatch, index)} icon={"times"} data-role={"remove-btn"}
                                        label={"Entfernen"}/>
                                <Numberinput min={1} value={quoteItem.quantity} label={'Stück'}
                                             inline noMargin
                                             onChange={event => updateBasket(dispatch, quoteItem.content_id, event.target.value, quoteItem.product_id, index)}/>
                                <Currency amount={quoteItem.gross_price * quoteItem.quantity}/>
                            </div>
                        </ItemPanel>
                    // </CSSTransition>
                )
            })}
            <MetaItemTable>
                <MetaItemRow>

                    <td>Zwischensumme Artikel</td>
                    <PriceCell><Currency
                        amount={quote.items.reduce((acc, current) => acc + current.gross_price * current.quantity, 0)}/>
                    </PriceCell>
                </MetaItemRow>
                {/*<MetaItemRow>*/}

                {/*    <td>{quote.packaging_item.product_id}</td>*/}
                {/*    <PriceCell><Currency amount={quote.packaging_item.gross_price}/></PriceCell>*/}
                {/*</MetaItemRow>*/}
                <MetaItemRow>

                    <td>{t('commerce:' + quote.postage_item.product_id)}</td>
                    <PriceCell><Currency amount={quote.postage_item.gross_price}/></PriceCell>
                </MetaItemRow>
                <MetaItemRow>

                    <td>{t('inkl. 7% Mehrwertsteuer')}</td>
                    <PriceCell><Currency amount={quote.gross_total - quote.net_total}/></PriceCell>
                </MetaItemRow>
                <MetaItemRow>

                    <td className={'overline'}><strong>Gesamt</strong></td>
                    <PriceCell className={'overline'}><strong><Currency amount={quote.gross_total}/></strong>
                    </PriceCell>
                </MetaItemRow>
            </MetaItemTable>
        </>
    );
};

AddressForm.propTypes = {
    quote: PropTypes.object,
    quotedVariants: PropTypes.array
}

export default BasketListing;