import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {useTranslation} from "react-i18next";
import {template} from "lodash";
import {ADDRESS, ORDER, USER, VARIANTS} from "../../actions/action_constants";
import {Row} from "../gui/Grid";
import {Alert} from "../gui/Alert";
import Addresses from "./Addresses";
import Basket from "./Basket";
import AddressView from "./AddressView";
import BasketListing from "./BasketListing";
import {Radio} from "../gui/Radio";
import AddressForm, {defaults as addressDefaults} from "./AddressForm";
import {Checkbox} from "../gui/Checkbox";
import LoginForm from "../LoginForm";
import StepIndicator from "../gui/StepIndicator";
import uuidv4 from "../../utility/uuid";
import {useNavigate} from "react-router-dom";

// TODO Kommentar anfügen

const placeOrder = (dispatch, shippingAddress, invoiceAddress, paymentMethod, idempotencyKey) => {
    dispatch({
        type: ORDER.CREATE.REQUEST,
        payload: {shippingAddress, invoiceAddress, paymentMethod, idempotencyKey}
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

    const {t} = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        document.getElementsByClassName("App")[0].scrollTo(0, 0);
        dispatch({type: ADDRESS.GET.REQUEST})
    }, []);

    // const [step, changeStep] = useState(3);
    const [step, changeStep] = useState(0);
    const [autoLoggedin, setAutologgedin] = useState(false);

    const [enterShippingAddress, setEnterShippingAddress] = useState(false); // new shipping address?
    const [validShippingAddress, setValidShippingAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({id: null});

    const showShippingAddressForm = addresses.length === 0 || enterShippingAddress;

    const [useInvoiceAddress, setUseInvoiceAddress] = useState(false);
    const [enterInvoiceAddress, setEnterInvoiceAddress] = useState(false); // new invoice address?
    const [validInvoiceAddress, setValidInvoiceAddress] = useState(false);
    const [invoiceAddress, setInvoiceAddress] = useState({is_invoice_addr: true, id: null});
    const showInvoiceAddressForm = enterInvoiceAddress;

    const [paymentMethod, setPaymentMethod] = useState('invoice');

    if (user.logged_in && step === 0 && !autoLoggedin) {
        changeStep(1);
        setAutologgedin(true);
    }

    const back = <Button label={"Zurück"} onClick={() => changeStep(Math.max(step - 1, 0))}/>

    const addressSection =
        <section>
            {showShippingAddressForm && <form
                onChange={() => {
                    shippingAddress.id !== null && setShippingAddress({...shippingAddress, id: null});
                    setValidShippingAddress(document.getElementById("shipping-address-form").checkValidity())
                }}
                id={"shipping-address-form"}>
                <AddressForm modelCallback={model => setShippingAddress(model)} initial={shippingAddress}/>
            </form>}

            {!showShippingAddressForm &&
            <Button label={"Neue Addresse"} onClick={() => setEnterShippingAddress(true)}/>}

            {addresses.length > 0 && <>
                <h3>Hinterlegte Adressen</h3>
                <Radio name={"checkout-shipping-address-radio"} onChange={value => {
                    setEnterShippingAddress(false);
                    setShippingAddress({...shippingAddress, id: parseInt(value)})
                }}
                       value={shippingAddress.id}
                       options={addresses.map(address => {
                           return {
                               component: <AddressView {...address} />,
                               value: address.id
                           }
                       })}/>
            </>}

            <hr/>

            <Checkbox label={"Separate Rechnungsadresse"} name={"checkout-use-invoice-address"}
                      value={useInvoiceAddress}
                      onChange={event => setUseInvoiceAddress(event.target.checked)}/>

            {useInvoiceAddress && <>
                {showInvoiceAddressForm && <form
                    onChange={() => {
                        invoiceAddress.id !== null && setInvoiceAddress({...invoiceAddress, id: null});
                        setValidInvoiceAddress(document.getElementById("invoice-address-form").checkValidity())
                    }}
                    id={"invoice-address-form"}>
                    <AddressForm modelCallback={model => setInvoiceAddress(model)} initial={invoiceAddress}/>
                </form>}
                {!showInvoiceAddressForm &&
                <Button label={"Neue Rechnungsaddresse"} onClick={() => setEnterInvoiceAddress(true)}/>}

                {addresses.length > 0 && <>
                    <Radio name={"checkout-invoice-address-radio"}
                           onChange={value => {
                               setEnterInvoiceAddress(false);
                               setInvoiceAddress({...invoiceAddress, id: parseInt(value)})
                           }}
                           value={invoiceAddress.id}
                           options={addresses.map(address => {
                               return {
                                   component: <AddressView {...address} />,
                                   value: address.id
                               }
                           })}/>
                </>}

            </>}
            <br/>
            {back}
            <Button label={"Weiter zur Bezahlmethode"} onClick={() => changeStep(2)} primary rightAction
                    disabled={!((shippingAddress.id !== null || validShippingAddress)
                        && (!useInvoiceAddress || (invoiceAddress.id !== null || validInvoiceAddress)))}/>
                    <br />
        </section>

    const paymentSection = <section>
        <Radio padded value={paymentMethod} name={'payment-method'} onChange={setPaymentMethod} options={[
            {
                label: <div>Rechnung<br/><small>Sie erhalten zusammen mit der Ware eine Rechnung,
                    die Sie innerhalb von 14 Tagen begleichen.</small></div>, value: "invoice"
            },
            {
                label: <div>PayPal (zur Zeit noch nicht verfügbar)<br/><small>Sie werden nach Abschluss des Bestellvorgangs zu PayPal
                    weitergeleitet. Sie benötigen ein PayPal-Benutzerkonto.</small></div>,
                value: "paypal",
                disabled: true
            }
        ]}/>
        <br/>
        {back}
        <Button label={"Weiter zur Übersicht"} onClick={() => changeStep(3)} primary rightAction
                disabled={paymentMethod === null}/>
    </section>

    const checkSection = <section>
        {/*<h2>Überprüfen</h2>*/}
        <div>Eingeloggt als {user.email}</div>
        <p>
            <strong>Lieferadresse</strong><br/>
            <AddressView {...(shippingAddress.id !== null ? user.addresses.find(address => address.id === shippingAddress.id) : shippingAddress)} />
        </p>

        {useInvoiceAddress &&
        <p>
            <strong>Rechnungsadresse</strong><br/>
            <AddressView {...(invoiceAddress.id !== null ? user.addresses.find(address => address.id === invoiceAddress.id) : invoiceAddress)} />
        </p>
        }

        <p>
            <strong>Bezahlmethode</strong><br/>
            {t('commerce:' + paymentMethod)}
        </p>


        <br/>
        {back}
        <Button label={"Kostenpflichtig bestellen"}
                icon={"handshake"}
                onClick={() => placeOrder(dispatch, shippingAddress, useInvoiceAddress ? invoiceAddress : null, paymentMethod, idempotencyKey)}
                primary large rightAction
                disabled={paymentMethod === null || orderState.pending}/>
    </section>

    const steps = ["Anmeldung", "Addresse", "Bezahlmethode", "Überprüfen"]

    return (
            <Row>
                <div className={"col-sm-5"}>
                    <div style={{position: 'sticky', top: 12}}>

                        <StepIndicator steps={steps} current={step}/>

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
                                    <Button label={"Ausloggen"}
                                            onClick={event => dispatch({type: USER.LOGOUT.REQUEST})}/>
                                    <Button label={"Weiter zur Addresse"} onClick={() => changeStep(1)} primary
                                            rightAction
                                            disabled={!user.logged_in}/>
                                </>
                                :
                                <>
                                    <LoginForm/>
                                    {/*<Button label={"Als Gast fortfahren"} onClick={() => changeStep(1)}/>*/}
                                </>
                            }
                        </div>

                        }
                        {step === 1 && addressSection}
                        {step === 2 && paymentSection}
                        {step === 3 && checkSection}
                    </div>
                </div>
                <div className={"col-sm-6 col-sm-offset-1"}>
                    <h2>Warenkorb</h2>
                    <BasketListing/>
                    <br />
                    <br />
                    <br />
                </div>
            </Row>

    );
};

export default Checkout;