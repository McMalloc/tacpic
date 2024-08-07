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
import { Button } from "../gui/Button";
import { Link } from "react-router-dom";
import styled from 'styled-components/macro';
import env from "../../env.json";
import Well from "../gui/Well";
import Loader, { LoaderOverlay } from "../gui/Loader";
import Select from "../gui/Select";
import InfoLabel from "../gui/InfoLabel";

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
    margin-bottom: 1rem;
  }

  .middle {
      text-align: center;
    img {
            box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
          }
  }
  .lower {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    button {
        align-self: flex-end;
    }
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

const Wrapper = styled.div`
  position: relative;
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
        <Wrapper>
            {quotedVariants.length > 0 ? quote.items.map((quoteItem, index) => {
                const correspondingVariant = quotedVariants.find(v => v.id === quoteItem.content_id);
                if (!correspondingVariant) return null
                return (
                    // <CSSTransition in={quote.items} timeout={200} classNames={'item'}>
                        <ItemPanel role={'group'} key={index}>
                        <div className={'hidden-for-mail-copy'}>
                                {quoteItem.quantity} × {correspondingVariant.graphic_title}, {correspondingVariant.title}__SPACE__
                                {quoteItem.product_id === 'graphic' ? 'mit Bildbeschreibung als Prägung' : ''} __SPACE__
                                Dateiname: {correspondingVariant.current_file_name}__SPACE__ 
                                {t('{{amount, currency}}', {amount: quoteItem.gross_price * quoteItem.quantity})}, Einzelpreis: {t('{{amount, currency}}', {amount: quoteItem.gross_price})}
                        </div>
                            <div aria-label={t('catalogue:fullTitle', { graphicTitle: correspondingVariant.graphic_title, variantTitle: correspondingVariant.title })} className={'upper breakable-long-lines'}>
                                <Link
                                    to={`/catalogue/${correspondingVariant.graphic_id}/variant/${correspondingVariant.id}`}>
                                    <strong>{correspondingVariant.graphic_title} ({correspondingVariant.title})</strong>
                                </Link>
                            </div>
                            <div className={'middle'}>
                                <img aria-hidden={true} alt={t('catalogue:variantPreviewAlt')} style={{ height: 'auto', maxHeight: '100%', width: 'auto' }}
                                    src={`${env.API_URL}/thumbnails/${correspondingVariant.current_file_name}-THUMBNAIL-sm-p0.png`} />
                            </div>
                            <InfoLabel
                                title={'catalogue:brailleSystem'}
                                info={correspondingVariant.system.replace(':', '.')}
                                label={'catalogue:brailleSystem'} />

                            <InfoLabel
                                title={'catalogue:graphicPagesFormat'}
                                info={`${correspondingVariant.graphic_no_of_pages} × ${t(
                                    `catalogue:${correspondingVariant.graphic_format}-${correspondingVariant.graphic_landscape ? "landscape" : "portrait"
                                    }`
                                )}`}
                                label={'catalogue:graphicPages'} />

                            {correspondingVariant.braille_no_of_pages !== 0 &&
                                <Select label={'commerce:descriptionAs'}
                                    value={quoteItem.product_id}
                                    onChange={event => updateBasket(dispatch, quoteItem.content_id, quoteItem.quantity, event.value, index)}
                                    name={"product_type_" + index}
                                    options={[
                                        {
                                            label: t('catalogue:orderWithBrailleEmboss', { count: correspondingVariant.braille_no_of_pages }),
                                            sublabel: t("catalogue:orderWithBrailleEmbossHint"),
                                            value: 'graphic'
                                        },
                                        {
                                            label: 'catalogue:orderWithBrailleMailPlain',
                                            sublabel: "catalogue:orderWithBrailleMailHint",
                                            value: 'graphic_nobraille'
                                        }
                                    ]} />
                            }

                            <div className={'lower'}>
                                <Button onClick={() => removeItem(dispatch, index)} icon={"times"} data-role={"remove-btn"}
                                    label={"remove"} />
                                <Numberinput min={1} value={quoteItem.quantity} label={'catalogue:pcs'}
                                    inline noMargin
                                    onChange={event => updateBasket(
                                        dispatch,
                                        quoteItem.content_id,
                                        Math.max(1, event.target.value),
                                        quoteItem.product_id,
                                        index)} />

                                <div>

                                    <div style={{fontSize: '0.85rem'}}>
                                        {quoteItem.quantity !== 1 &&
                                        <>{t('catalogue:singlePrice', {
                                            amount: quoteItem.gross_price
                                        })}</>

                                        }
                                    </div>
                                    <InfoLabel
                                        title={'catalogue:price'}
                                        info={t('{{amount, currency}}', {
                                            amount: quoteItem.gross_price * quoteItem.quantity
                                        })}
                                        label={'catalogue:price'} />
                                </div>


                            </div>
                        </ItemPanel>
                    // </CSSTransition>
                )

            }):
                <Loader />
            }
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


            {quote.pending &&
                <LoaderOverlay>
                    <Loader />
                </LoaderOverlay>
            }
        </Wrapper>
    );
};

AddressForm.propTypes = {
    quote: PropTypes.object,
    quotedVariants: PropTypes.array
}

export default BasketListing;