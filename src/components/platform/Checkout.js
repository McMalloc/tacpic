import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../gui/Button";
import { useTranslation } from "react-i18next";
import { template } from "lodash";
import { ADDRESS, ORDER, USER, VARIANTS } from "../../actions/action_constants";
import { Row } from "../gui/Grid";
import { Alert } from "../gui/Alert";
import Addresses from "./Addresses";
import Basket from "./Basket";
import AddressView from "./AddressView";
import BasketListing from "./BasketListing";
import { Radio } from "../gui/Radio";
import AddressForm, { defaults as addressDefaults } from "./AddressForm";
import { Checkbox } from "../gui/Checkbox";
import LoginForm from "../LoginForm";
import StepIndicator from "../gui/StepIndicator";
import uuidv4 from "../../utility/uuid";
import { useNavigate } from "react-router-dom";
import { Sub } from "../gui/_Label";

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
    const idempotencyKey = uuidv4();
    const orderState = useSelector(state => state.catalogue.order);

    if (!orderState.pending && orderState.successful) navigate('/order-completed');

    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        document.getElementById("app-container").scrollTo(0, 0);
        dispatch({ type: ADDRESS.GET.REQUEST })
    }, []);

    // const [step, changeStep] = useState(3);
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

    const back = <Button label={"Zurück"} onClick={() => changeStep(Math.max(step - 1, 0))} />

    const addressSection =
        <section>
            {addresses.length > 0 && <>
                <Radio name={"checkout-shipping-address-radio"} legend={'Hinterlegte Adressen'} onChange={value => {
                    setEnterShippingAddress(false);
                    setShippingAddress({ ...shippingAddress, id: parseInt(value) })
                }}
                    value={shippingAddress.id}
                    options={addresses.map(address => {
                        return {
                            component: <AddressView {...address} />,
                            value: address.id
                        }
                    })} />
            </>}
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
                <Button icon={'plus'} label={"Neue Addresse"} onClick={() => setEnterShippingAddress(true)} />}
            <br />
            <br />
            <Checkbox label={"Separate Rechnungsadresse"} name={"checkout-use-invoice-address"}
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
                                component: <AddressView {...address} />,
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
                    <Button icon={'plus'} label={"Neue Rechnungsaddresse"} onClick={() => setEnterInvoiceAddress(true)} />}

            </>}
            <br />
            <br />
            {back}
            <Button label={"Weiter zur Bezahlmethode"} onClick={() => changeStep(2)} primary rightAction
                disabled={!((shippingAddress.id !== null || validShippingAddress)
                    && (!useInvoiceAddress || (invoiceAddress.id !== null || validInvoiceAddress)))} />
            <br />
        </section>

    const paymentSection = <section>
        <Radio padded value={paymentMethod} name={'payment-method'} onChange={setPaymentMethod} options={[
            {
                label: <div>{t('commerce:invoice')}<br />
                    <span className={'sub-label'}>{t('commerce:invoice_payment_hint')}</span>
                </div>,
                value: "invoice"
            },
            {
                label: <div>{t('commerce:paypal')}<br />
                    <span className={'sub-label'}>{t('commerce:paypal_payment_hint')}</span>
                </div>,
                value: "paypal",
                disabled: true
            }
        ]} />
        <br />
        {back}
        <Button label={"Weiter zur Übersicht"} onClick={() => changeStep(3)} primary rightAction
            disabled={paymentMethod === null} />
    </section>

    const checkSection = <section>
        {/*<h2>Überprüfen</h2>*/}
        <div>Eingeloggt als {user.email}</div>
        <p>
            <strong>Lieferadresse</strong><br />
            <AddressView {...(shippingAddress.id !== null ? user.addresses.find(address => address.id === shippingAddress.id) : shippingAddress)} />
        </p>

        {useInvoiceAddress &&
            <p>
                <strong>Rechnungsadresse</strong><br />
                <AddressView {...(invoiceAddress.id !== null ? user.addresses.find(address => address.id === invoiceAddress.id) : invoiceAddress)} />
            </p>
        }

        <p>
            <strong>Bezahlmethode</strong><br />
            {t('commerce:' + paymentMethod)}
        </p>

        <p><strong>Hinweis</strong><br />
            Bitte nehmen Sie unsere <a href={"/legal/de/Allgemeine%20Gesch%C3%A4ftsbedingungen%20und%20Kundeninformationen"}>Allgemeinen Geschäftsbedingungen (AGB)</a> zur Kenntnis.
        </p>

        <br />
        {back}
        <Button label={"Kostenpflichtig bestellen"}
            icon={orderState.pending ? "cog fa-spin" : "handshake"}
            onClick={() => placeOrder(dispatch, shippingAddress, useInvoiceAddress ? invoiceAddress : null, paymentMethod, idempotencyKey)}
            primary rightAction
            disabled={paymentMethod === null || orderState.pending} />
        <br />
    </section>

    const steps = ["Anmeldung", "Addresse", "Bezahlmethode", "Überprüfen"]

    return (
        <>
            <Row>
                <div className={"col-xs-12 col-md-5"}>
                    <div style={{ position: 'sticky', top: 12 }}>

                        <StepIndicator steps={steps} current={step} />

                        {/*<p>Current Information</p>*/}
                        {/*<ul>*/}
                        {/*    <li><AddressView {...user.addresses.find(address => address.id === shippingAddress)} /></li>*/}
                        {/*    <li><AddressView {...user.addresses.find(address => address.id === invoiceAddress)} /></li>*/}
                        {/*    <li>{paymentMethod}</li>*/}
                        {/*</ul>*/}

                        {step === 0 &&
                            <div>
                                {user.logged_in ?
                                    <><p>Eingeloggt als {user.email}</p>
                                        <Button label={t("general:logoff")}
                                            onClick={event => dispatch({ type: USER.LOGOUT.REQUEST })} />
                                        <Button label={"Weiter zur Addresse"} onClick={() => changeStep(1)} primary
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
                            <><Alert danger>
                                Bestellung fehlgeschlagen<br />
                                {orderState.error.type}: {orderState.error.message}
                            </Alert><br /></>
                        }

                        <br />
                        <Alert i18nKey={'commerce:betaHint'} danger>
                            Die Plattform befindet sich in der Alpha-Phase, d.h. sie wird noch getestet.<br />
                            <strong>Getätigte Bestellungen werden entgegen der Beschriftung nicht ausgelöst und es fallen
                            keine Kosten an.</strong>
                        </Alert>
                    </div>




                </div>
                <div className={"col-xs-12 col-md-6 col-md-offset-1"}>
                    <div style={{ position: 'sticky', top: 12 }}>
                        <h2>Warenkorb</h2>
                        <BasketListing />
                        <br />
                        <br />
                    </div>
                </div>
            </Row>
        </>
    );
};

export default Checkout;