import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../gui/Button";
import { Trans, useTranslation } from "react-i18next";
import {ADDRESS, ORDER, ORDER_RESET, USER} from "../../actions/action_constants";
import { Row } from "../gui/Grid";
import { Alert } from "../gui/Alert";
import AddressView from "./AddressView";
import BasketListing from "./BasketListing";
import { Radio } from "../gui/Radio";
import AddressForm, { defaults as addressDefaults } from "./AddressForm";
import { Checkbox } from "../gui/Checkbox";
import LoginForm from "../LoginForm";
import StepIndicator from "../gui/StepIndicator";
import uuidv4 from "../../utility/uuid";
import { useNavigate } from "react-router-dom";
import { MAX_VALUE_FOR_ORDER } from "../../config/constants";
import ServerError from "./ServerError";

// TODO Kommentar anfügen

const placeOrder = (dispatch, shippingAddress, invoiceAddress, paymentMethod, idempotencyKey) => {
    dispatch({
        type: ORDER.CREATE.REQUEST,
        payload: { shippingAddress, invoiceAddress, paymentMethod, idempotencyKey }
    })
}

const Checkout = props => {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    // const invoiceAddresses = user.addresses.filter(address => address.is_invoice_addr);
    // const shippingAddresses = user.addresses.filter(address => !address.is_invoice_addr);
    const addresses = user.addresses;

    const orderState = useSelector(state => state.catalogue.order);
    const emptyBasket = useSelector(state => state.catalogue.basket.length === 0);
    const quote = useSelector(state => state.catalogue.quote);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        document.getElementById("app-container").scrollTo(0, 0);
        dispatch({ type: ORDER_RESET});
        dispatch({ type: ADDRESS.GET.REQUEST });
    }, []);

    // const [step, changeStep] = useState(3);
    const [idempotencyKey, setIdempotencyKey] = useState(uuidv4());
    const [step, changeStep] = useState(0);
    const [autoLoggedin, setAutologgedin] = useState(false);

    const [enterShippingAddress, setEnterShippingAddress] = useState(false); // new shipping address?
    const [validShippingAddress, setValidShippingAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({ id: null });

    const showShippingAddressForm = addresses.length === 0 || enterShippingAddress;

    const [useInvoiceAddress, setUseInvoiceAddress] = useState(false);
    const [enterInvoiceAddress, setEnterInvoiceAddress] = useState(false); // new invoice address?
    const [validInvoiceAddress, setValidInvoiceAddress] = useState(false);
    const [invoiceAddress, setInvoiceAddress] = useState({ is_invoice_addr: true, id: null });
    const showInvoiceAddressForm = enterInvoiceAddress;

    const [paymentMethod, setPaymentMethod] = useState('invoice');

    if (user.logged_in && step === 0 && !autoLoggedin) {
        changeStep(1);
        setAutologgedin(true);
    }

    if (emptyBasket) navigate('/basket');
    if (!orderState.pending && orderState.successful) navigate('/order-completed');

    const back = <Button label={"back"} onClick={() => changeStep(Math.max(step - 1, 0))} />

    const addressSection =
        <section>
            {addresses.length > 0 && <>
                <Radio padded name={"checkout-shipping-address-radio"} legend={'commerce:savedAddresses'} onChange={value => {
                    setEnterShippingAddress(false);
                    setShippingAddress({ ...shippingAddress, id: parseInt(value) })
                }}
                    value={shippingAddress.id}
                    options={addresses.map(address => {
                        return {
                            label: `${address.first_name} ${address.last_name}\n${address.street} ${address.house_number}\n${address.zip} ${address.city}`,
                            value: address.id
                        }
                    })} />
            </>}
            <br />
            {showShippingAddressForm && <form
                onChange={() => {
                    shippingAddress.id !== null && setShippingAddress({ ...shippingAddress, id: null });
                    setValidShippingAddress(document.getElementById("shipping-address-form").checkValidity())
                }}
                id={"shipping-address-form"}>
                <AddressForm modelCallback={model => setShippingAddress(model)} initial={shippingAddress} />
            </form>}

            <br />

            {!showShippingAddressForm &&
                <Button icon={'plus'} label={'commerce:newAddress'} onClick={() => {
                    setShippingAddress({id: null});
                    setEnterShippingAddress(true);
                    }} />}
            <br />
            <br />
            <Checkbox label={"commerce:separateInvoiceAddress"} name={"checkout-use-invoice-address"}
                value={useInvoiceAddress}
                onChange={event => setUseInvoiceAddress(event.target.checked)} />

            {useInvoiceAddress && <>

                {addresses.length > 0 && <>
                    <Radio name={"checkout-invoice-address-radio"}
                        onChange={value => {
                            setEnterInvoiceAddress(false);
                            setInvoiceAddress({ ...invoiceAddress, id: parseInt(value) })
                        }}
                        value={invoiceAddress.id}
                        options={addresses.map(address => {
                            return {
                                label: `${address.company_name}\n${address.first_name} ${address.last_name}\n${address.street} ${address.house_number}\n${address.zip} ${address.city}`,
                                value: address.id
                            }
                        })} />
                </>}
                <br />
                {showInvoiceAddressForm && <form
                    onChange={() => {
                        invoiceAddress.id !== null && setInvoiceAddress({ ...invoiceAddress, id: null });
                        setValidInvoiceAddress(document.getElementById("invoice-address-form").checkValidity())
                    }}
                    id={"invoice-address-form"}>
                    <AddressForm modelCallback={model => setInvoiceAddress(model)} initial={invoiceAddress} />
                </form>}
                {!showInvoiceAddressForm &&
                    <Button icon={'plus'} label={"commerce:addInvoiceAddress"} onClick={() => {
                        setInvoiceAddress({id: null});
                        setEnterInvoiceAddress(true);
                        }} />}

            </>}
            <br />
            <br />
            {back}
            <Button label={"commerce:toPaymentMethod"} onClick={() => changeStep(2)} primary rightAction
                disabled={!((shippingAddress.id !== null || validShippingAddress)
                    && (!useInvoiceAddress || (invoiceAddress.id !== null || validInvoiceAddress)))} />
            <br />
        </section>

    const paymentSection = <section>
        <Radio padded value={paymentMethod} name={'payment-method'} onChange={setPaymentMethod} options={[
            {
                label: `${t('commerce:invoice')}\n${t('commerce:invoice_payment_hint')}`,
                value: "invoice"
            },
            {
                label: `${t('commerce:paypal')}\n${t('commerce:paypal_payment_hint')}`,
                value: "paypal",
                disabled: true
            }
        ]} />
        <br />
        {back}
        <Button label={"commerce:toOverview"} onClick={() => changeStep(3)} primary rightAction
            disabled={paymentMethod === null} />
    </section>

    const checkSection = <section>
        {/*<h2>Überprüfen</h2>*/}
        <div>{t('loggedInAs')} {user.email}</div>
        <p>
            <small>{t('commerce:shippingAddress')}</small><br />
            <AddressView {...(shippingAddress.id !== null ? user.addresses.find(address => address.id === shippingAddress.id) : shippingAddress)} />
        </p>

        {useInvoiceAddress &&
            <p>
                <small>{t('commerce:invoiceAddress')}</small><br />
                <AddressView {...(invoiceAddress.id !== null ? user.addresses.find(address => address.id === invoiceAddress.id) : invoiceAddress)} />
            </p>
        }

        <p>
            <small>{t('commerce:paymentMethod')}</small><br />
            {t('commerce:' + paymentMethod)}
        </p>

        <p><small>{t('hint')}</small><br />

            <Trans i18nKey={'commerce:eulaHint'}>
                0<a target={'_blank'} href={"/info/de/63?Allgemeine%20Gesch%C3%A4ftsbedingungen"} rel="noreferrer">
                    1
            </a>2
            </Trans>
            <br />
            <Alert info>{t('commerce:pleaseReviewOrder')}</Alert>


        </p>

        <br />
        {back}

        <br />
    </section>

    const steps = ["account:login", "commerce:address", "commerce:paymentMethod", "commerce:checkOverview"]

    return (
        <>
            <Row>
            <div className={"col-xs-12"}>
                <h1>{t('commerce:checkout')}</h1>
            </div>
                <div className={"col-xs-12 col-md-5"}>
                    <div style={{ position: 'sticky', top: 12 }}>

                        <StepIndicator steps={steps} current={step} />

                        {step === 0 &&
                            <div>
                                {user.logged_in ?
                                    <><p>{t('loggedInAs')} {user.email}</p>
                                        <Button label={t("account:logoff")}
                                            onClick={event => dispatch({ type: USER.LOGOUT.REQUEST })} />
                                        <Button label={"commerce:toAddress"} onClick={() => changeStep(1)} primary
                                            rightAction
                                            disabled={!user.logged_in} />
                                    </>
                                    :
                                    <LoginForm />
                                }
                            </div>

                        }
                        {step === 1 && addressSection}
                        {step === 2 && paymentSection}
                        {step === 3 && checkSection}

                        <br />
                        {orderState.error !== null &&
                            <><ServerError error={orderState.error} i18nKey={'commerce'} /><br /></>
                        }
                    </div>

                </div>
                <div className={"col-xs-12 col-md-6 col-md-offset-1"}>
                    <div style={{ position: 'sticky', top: 12 }}>
                        <h2>{t('commerce:basketHeading')}</h2>
                        <BasketListing />

                        {/*<Alert i18nKey={'commerce:betaHint'} danger>*/}
                        {/*    0<br /><strong>2</strong>*/}
                        {/*</Alert>*/}
                        <br />

                        {step === 3 &&
                            <>
                                {quote.gross_total > MAX_VALUE_FOR_ORDER ?
                                    <Alert warning>
                                        {t('commerce:orderTooLargeHint')}
                                    </Alert>
                                    :
                                    <Button label={"commerce:order"}
                                        icon={orderState.pending ? "cog fa-spin" : "handshake"}
                                        onClick={() => placeOrder(dispatch, shippingAddress, useInvoiceAddress ? invoiceAddress : null, paymentMethod, idempotencyKey)}
                                        primary rightAction large
                                        disabled={paymentMethod === null || orderState.pending} />
                                }
                            </>}
                        <br />
                    </div>
                </div>
            </Row>
        </>
    );
};

export default Checkout;