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

const ItemRow = styled.tr`
    [data-role="remove-btn"] {
          opacity: 0.0;
        }
    input[type="number"] {
      border-color: transparent;
    }

    &:hover {
    background-color: ${props=>props.theme.grey_6};
        input[type="number"] {
          border-color: inherit;
        }
        [data-role="remove-btn"] {
          opacity: 1;
        }
  }
`

const PreviewCell = styled.td`
  text-align: center;
  background-color: ${props=>props.theme.grey_6};
  border-left: 1px solid rgba(0,0,0,0.2);
  border-right: 1px solid rgba(0,0,0,0.2);
  img {
    box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
  }
`;

const MetaItemRow = styled.tr`
  text-align: right;
  &:last-child {
    font-weight: bold;
    
    td {
      border: none;
    }
    
    td:last-child {
      font-size: 150%;
      text-decoration: underline;
      color: ${props=>props.theme.brand_secondary};
    }
  }
`;

const Header = styled.tr`
  border-bottom: 2px solid ${props=>props.theme.grey_4};
`;

const PriceCell = styled.td`
  text-align: right;

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
    }, []);

    if (quote.items.length === 0) return null;

    return (
        <table>
            <Header>
            <th>Menge</th>
            <th></th>
            <th colSpan={2}>Produkt</th>
            <th>Preis</th>
            </Header>
            {quote.items.map((quoteItem, index) => {
                const correspondingVariant = quotedVariants.find(v => v.id === quoteItem.content_id);
                if (!correspondingVariant) return null
                return (
                    <ItemRow>
                        <td><Numberinput min={1} value={quoteItem.quantity}
                                         inline
                                         onChange={event => updateBasket(dispatch, quoteItem.content_id, event.target.value, quoteItem.product_id, index)}/>
                        </td>
                        <td><Button onClick={() => removeItem(dispatch, index)} icon={"times"} data-role={"remove-btn"}
                                    label={"Entfernen"}/>
                        </td>
                        <td>
                            <Link
                                to={`/catalogue/${correspondingVariant.graphic_id}/variant/${correspondingVariant.id}`}>
                                {correspondingVariant.graphic_title} ({correspondingVariant.title})
                            </Link>
                            <br/>
                            <small>
                                <div data-role={"product-select"}>
                                    <Radio
                                        onChange={value => updateBasket(dispatch, quoteItem.content_id, quoteItem.quantity, value, index)}
                                        name={"product_type_" + index}
                                        value={quoteItem.product_id} options={[
                                        {label: "mit Bildbeschreibung als Brailleprägung", value: "graphic"},
                                        {label: "Bildbeschreibung nur in E-Mail", value: "graphic_nobraille"}
                                    ]}/>
                                </div>

                            </small>

                        </td>
                        <PreviewCell><img style={{height: '70px', width: 'auto'}}
                                          src={`/thumbnails/${correspondingVariant.file_name}-THUMBNAIL-sm-p0.png`}/>
                        </PreviewCell>
                        <PriceCell><Currency amount={quoteItem.gross_price * quoteItem.quantity}/></PriceCell>
                    </ItemRow>
                )
            })}
            <MetaItemRow>
                <td></td>

                <td colSpan={2}>Zwischensumme</td><td></td>
                <PriceCell><Currency
                    amount={quote.items.reduce((acc, current) => acc + current.gross_price * current.quantity, 0)}/>
                </PriceCell>
            </MetaItemRow>
            <MetaItemRow>
                <td></td>

                <td colSpan={2}>{quote.packaging_item.product_id}</td><td></td>
                <PriceCell><Currency amount={quote.packaging_item.gross_price}/></PriceCell>
            </MetaItemRow>
            <MetaItemRow>
                <td></td>

                <td colSpan={2}>{quote.postage_item.product_id}</td><td></td>
                <PriceCell><Currency amount={quote.postage_item.gross_price}/></PriceCell>
            </MetaItemRow>
            <MetaItemRow>
                <td></td>

                <td colSpan={2}>7% Mehrwertsteuer</td><td></td>
                <PriceCell><Currency amount={quote.gross_total - quote.net_total}/></PriceCell>
            </MetaItemRow>
            <MetaItemRow>
                <td></td>

                <td colSpan={2}><strong>Gesamt</strong></td><td></td>
                <PriceCell><strong><Currency amount={quote.gross_total}/></strong>
                </PriceCell>
            </MetaItemRow>
        </table>

    );
};

AddressForm.propTypes = {
    quote: PropTypes.object,
    quotedVariants: PropTypes.array
}

export default BasketListing;