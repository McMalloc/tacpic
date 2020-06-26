import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {useTranslation} from "react-i18next";
import {template} from "lodash";
import {ORDER, VARIANTS} from "../../actions/action_constants";

const processPaymentForm = () => {
    let heidelpay = new window.heidelpay('s-pub-31HA07BC8142C5A171745D00AD63D182');
// Use Card payment type
    let Card = heidelpay.Card();
// Render the card number input field on #card-element-id-number
    Card.create('number', {
        containerId: 'card-element-id-number',
        onlyIframe: false
    }).then(console.log);
// Render the card expiry input field on #card-element-id-expiry
    Card.create('expiry', {
        containerId: 'card-element-id-expiry',
        onlyIframe: false
    });
// Render the card cvc input field on #card-element-id-cvc
    Card.create('cvc', {
        containerId: 'card-element-id-cvc',
        onlyIframe: false
    });
}

const Basket = props => {
    const user = useSelector(state => state.user);
    const basket = useSelector(state => state.catalogue.basket);
    const quote = useSelector(state => state.catalogue.quote);
    const quotedVariants = useSelector(state => state.catalogue.quotedVariants);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://static.heidelpay.com/v1/heidelpay.js";
        script.async = true;
        script.onload = () => setTimeout(processPaymentForm, 1000);

        // document.body.appendChild(script);
    }, []);

    useEffect(() => {
        dispatch({
            type: ORDER.QUOTE.REQUEST,
            payload: {items: basket}
        })
        dispatch({
            type: VARIANTS.GET.REQUEST,
            payload: {
                ids: basket.map(item => item.contentId)
            }
        })
    }, []);

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-md-12"}>
                    <h1>Warenkorb</h1>
                    <p>{template(t("commerce:total"))({amount: 3})}</p>
                    <Button icon={"handshake"} label={t("commerce:checkout")} primary large />

                    <table>
                        {quote.items.map((quoteItem, index) => {
                            const correspondingVariant = quotedVariants.find(v => v.id === quoteItem.content_id);
                            if (!correspondingVariant) return null
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td><img style={{height: '70px', width: 'auto'}}
                                             src={`/thumbnails/${correspondingVariant.file_name}-THUMBNAIL-sm-p0.png`}/>
                                    </td>
                                    <td>{quoteItem.productId}</td>
                                    <td>{correspondingVariant.title}</td>
                                    <td>{quoteItem.quantity}</td>
                                </tr>
                            )
                        })}
                    </table>

                    <form id="payment-form" className="heidelpayUI form" noValidate>
                        <div className="box">
                            <div className="field">
                                <div id={"card-element-id-number"} className="heidelpayInput"></div>
                            </div>
                            <div className="two fields">
                                <div className="field eight wide">
                                    <div id="card-element-id-expiry" className="heidelpayInput"></div>
                                </div>
                                <div className="field eight wide">
                                    <div id="card-element-id-cvc" className="heidelpayInput"></div>
                                </div>
                            </div>
                            <div className="field">
                                <button id="payment-button-id" disabled className="heidelpayUI primary button fluid"
                                        type="submit">Pay
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


        </div>

    );
};

export default Basket;