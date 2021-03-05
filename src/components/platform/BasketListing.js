import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import AddressForm from "./AddressForm";
import {
    ITEM_REMOVED_FROM_BASKET,
    ITEM_UPDATED_IN_BASKET,
    QUOTE,
    VARIANTS
} from "../../actions/action_constants";
import { useDispatch, useSelector } from "react-redux";
import { Numberinput } from "../gui/Input";
import { Radio } from "../gui/Radio";
import { Button } from "../gui/Button";
import { Link } from "react-router-dom";
import styled from 'styled-components/macro';
import { API_URL } from "../../env.json";
import Well from "../gui/Well";
// import {CSSTransition} from "react-transition-group";

const updateBasket = (dispatch, variantId, quantity, product, index) => {
    dispatch({
        type: ITEM_UPDATED_IN_BASKET,
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

const ItemPanel = styled(Well)`
  margin-bottom: 12px;

  .upper {
    display: flex;
    
    .left {
      flex: 1 1 30%;
      height: 120px;
      padding-right: 0.5rem;
      padding-bottom: 0.5rem;
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
      font-size: 1.5rem;
      text-decoration: underline;
      color: ${props => props.theme.brand_secondary};
    }
  }
`;
const PriceCell = styled.td`
  text-align: right;
  min-width: min-content;
  /* width: 100px; */
`;

const BasketListing = () => {
    const { t } = useTranslation();
    const basket = useSelector(state => state.catalogue.basket);
    const quote = useSelector(state => state.catalogue.quote);
    const quotedVariants = useSelector(state => state.catalogue.quotedVariants);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: QUOTE.GET.REQUEST,
            payload: { items: basket }
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
                console.log(correspondingVariant);
                return (
                    // <CSSTransition in={quote.items} timeout={200} classNames={'item'}>
                    <ItemPanel key={index}>
                        <div className={'upper'}>
                            <div className={'left'}>
                                <img style={{ height: 'auto', maxHeight: '100%', width: 'auto' }}
                                    src={`${API_URL}/thumbnails/${correspondingVariant.current_file_name}-THUMBNAIL-sm-p0.png`} />
                            </div>
                            <div className={'right'}>
                                <Link
                                    to={`/catalogue/${correspondingVariant.graphic_id}/variant/${correspondingVariant.id}`}>
                                    <strong>{correspondingVariant.graphic_title} ({correspondingVariant.title})</strong>
                                </Link>
                                <p>
                                    {t('glossary:microcapsule')} <br />
                                    {correspondingVariant.graphic_no_of_pages} &times; {t('catalogue:' + correspondingVariant.graphic_format + '-' + (correspondingVariant.graphic_landscape ? 'landscape' : 'portrait'))}
                                    <br />
                                    <span>{t(correspondingVariant.system.replace(':', '.'))}</span>
                                </p>

                            </div>
                        </div>
                        {correspondingVariant.braille_no_of_pages !== 0 &&
                            <div className={'middle'}>
                                <Radio
                                    onChange={value => updateBasket(dispatch, quoteItem.content_id, quoteItem.quantity, value, index)}
                                    legend={'commerce:descriptionAs'}
                                    name={"product_type_" + index}
                                    value={quoteItem.product_id} options={[
                                        {
                                            label: ['commerce:productSelectWithBraille', { count: correspondingVariant.braille_no_of_pages }],
                                            value: "graphic"
                                        },
                                        { label: "commerce:perEMail", value: "graphic_nobraille" }
                                    ]} />
                            </div>
                        }

                        <div className={'lower'}>
                            <Button onClick={() => removeItem(dispatch, index)} icon={"times"} data-role={"remove-btn"}
                                label={"remove"} />
                            <Numberinput min={1} value={quoteItem.quantity} label={'catalogue:pcs'}
                                inline noMargin
                                onChange={event => updateBasket(dispatch, quoteItem.content_id, event.target.value, quoteItem.product_id, index)} />
                            {t('{{amount, currency}}', {
                                amount: quoteItem.gross_price * quoteItem.quantity
                            })}
                        </div>
                    </ItemPanel>
                    // </CSSTransition>
                )
            })}
            <MetaItemTable>
                <tbody>
                    <MetaItemRow>
                        <td>{t('commerce:subtotal')}</td>
                        <PriceCell>
                        {t('{{amount, currency}}', {
                                amount: quote.items.reduce((acc, current) => acc + current.gross_price * current.quantity, 0)
                            })}
                        </PriceCell>
                    </MetaItemRow>
                    <MetaItemRow>

                        <td>{t('commerce:' + quote.postage_item.product_id)}</td>
                        <PriceCell>
                            {t('{{amount, currency}}', {
                                amount: quote.postage_item.gross_price
                            })}
                        </PriceCell>
                    </MetaItemRow>
                    <MetaItemRow>

                        <td>{t('commerce:inclVAT', { amount: 7 })}</td>
                        <PriceCell>
                            {t('{{amount, currency}}', {
                                amount: quote.gross_total - quote.net_total
                            })}
                        </PriceCell>
                    </MetaItemRow>
                    <MetaItemRow>

                        <td className={'overline'}><strong>{t('commerce:total')}</strong></td>
                        <PriceCell className={'overline'}><strong>
                            {t('{{amount, currency}}', {
                                amount: quote.gross_total
                            })}
                        </strong>
                        </PriceCell>
                    </MetaItemRow>
                </tbody>

            </MetaItemTable>
        </>
    );
};

AddressForm.propTypes = {
    quote: PropTypes.object,
    quotedVariants: PropTypes.array
}

export default BasketListing;