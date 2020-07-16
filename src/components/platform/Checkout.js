import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {useTranslation} from "react-i18next";
import {template} from "lodash";
import {ADDRESS, ORDER, USER, VARIANTS} from "../../actions/action_constants";
import {Container, Row} from "../gui/Grid";
import {Alert} from "../gui/Alert";
import Addresses from "./Addresses";
import Basket from "./Basket";
import AddressView from "./AddressView";
import BasketListing from "./BasketListing";
import {Radio} from "../gui/Radio";
import AddressForm, {defaults as addressDefaults} from "./AddressForm";
import {Checkbox} from "../gui/Checkbox";
import LoginForm from "../LoginForm";

// TODO Kommentar anfügen

const placeOrder = (dispatch, shippingAddress, invoiceAddress, paymentMethod) => {
    dispatch({
        type: ORDER.CREATE.REQUEST,
        payload: {shippingAddress, invoiceAddress, paymentMethod}
    })
}

const Checkout = props => {
    const user = useSelector(state => state.user);
    const invoiceAddresses = user.addresses.filter(address => address.is_invoice_address);
    const shippingAddresses = user.addresses.filter(address => !address.is_invoice_address);

    const {t} = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({type: ADDRESS.GET.REQUEST})
    }, []);

    const [step, changeStep] = useState(0);
    const [autoLoggedin, setAutologgedin] = useState(false);

    const [enterShippingAddress, setEnterShippingAddress] = useState(false); // new shipping address?
    const [validShippingAddress, setValidShippingAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(addressDefaults);

    const showShippingAddressForm = shippingAddresses.length === 0 || enterShippingAddress;

    const [useInvoiceAddress, setUseInvoiceAddress] = useState(false);
    const [enterInvoiceAddress, setEnterInvoiceAddress] = useState(false); // new invoice address?
    const [validInvoiceAddress, setValidInvoiceAddress] = useState(false);
    const [invoiceAddress, setInvoiceAddress] = useState({...addressDefaults, is_invoice_addr: true});
    const showInvoiceAddressForm = invoiceAddresses.length === 0 || enterInvoiceAddress;

    const [paymentMethod, setPaymentMethod] = useState(null);

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
                <AddressForm modelCallback={model => setShippingAddress(model)} initial={{is_invoice_address: false}}/>
            </form>}

            {!showShippingAddressForm &&
            <Button label={"Neue Addresse"} onClick={() => setEnterShippingAddress(true)}/>}

            {shippingAddresses.length > 0 && <>
                <h3>Hinterlegte Lieferadressen</h3>
                <Radio name={"checkout-address-radio"} onChange={value => setShippingAddress({...shippingAddress, id: parseInt(value)})}
                       value={shippingAddress.id}
                       options={shippingAddresses.map(address => {
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
                        invoiceAddress.id !== null && setShippingAddress({...invoiceAddress, id: null});
                        setValidInvoiceAddress(document.getElementById("invoice-address-form").checkValidity())
                    }}
                    id={"invoice-address-form"}>
                    <AddressForm modelCallback={model => setInvoiceAddress(model)} initial={shippingAddress}/>
                </form>}
                {!showInvoiceAddressForm &&
                <Button label={"Neue Rechnungsaddresse"} onClick={() => setEnterInvoiceAddress(true)}/>}

                {invoiceAddresses.length > 0 && <>
                    <h3>Hinterlegte Rechnungsadressen</h3>
                    <Radio name={"checkout-address-radio"} onChange={value => setInvoiceAddress(parseInt(value))}
                           value={invoiceAddress}
                           options={invoiceAddresses.map(address => {
                               return {
                                   component: <AddressView {...address} />,
                                   value: address.id
                               }
                           })}/>
                </>}

            </>}
            {back}
            <Button label={"Weiter zur Bezahlmethode"} onClick={() => changeStep(2)} primary
                    disabled={!((shippingAddress.id !== null || validShippingAddress) && (!useInvoiceAddress || (invoiceAddress !== null || validInvoiceAddress)))}/>
        </section>

    const paymentSection = <section>
        <Radio value={paymentMethod} onChange={setPaymentMethod} options={[
            {
                component: <div>Rechnung<br/><small>Sie erhalten zusammen mit der Ware eine Rechnung,
                    die Sie innerhalb von 14 Tagen begleichen.</small></div>, value: "invoice"
            },
            {
                label: <div>PayPal<br/><small>Sie werden nach Abschluss des Bestellvorgangs zu PayPal
                    weitergeleitet. Sie benötigen ein PayPal-Benutzerkonto.</small></div>,
                value: "paypal"
            }
        ]}/>
        {back}
        <Button label={"Weiter zur Übersicht"} onClick={() => changeStep(3)} primary
                disabled={paymentMethod === null}/>
    </section>

    const checkSection = <section>
        <h2>Überprüfen</h2>
        <div>Eingeloggt als {user.email}</div>
        <div>
            <h3>Lieferadresse</h3>
            <AddressView {...user.addresses.find(address => address.id === shippingAddress)} />
        </div>

        <div>
            <h3>Bezahlmethode</h3>
            {paymentMethod}
        </div>

        {!!invoiceAddress &&
        <div>
            <h3>Rechnungsadresse</h3>
            <AddressView {...user.addresses.find(address => address.id === invoiceAddress)} />
        </div>
        }

        {back}
        <Button label={"Kostenpflichtig bestellen"}
                icon={"handshake"}
                onClick={() => placeOrder(dispatch, shippingAddress, useInvoiceAddress ? invoiceAddress : null, paymentMethod)}
                primary large
                disabled={paymentMethod === null}/>
    </section>

    const steps = ["Anmeldung", "Addresse", "Bezahlmethode", "Überprüfen"]
    const breadcrumbs = <div>{[0, 1, 2, 3].map(n => {
        if (n === step) {
            return <strong>{n + 1} {steps[n]}</strong>
        } else {
            return <span>{n + 1} {steps[n]}</span>
        }
    })}</div>

    return (
        <Container>
            <Row>
                <div className={"col-xs-6"}>

                    {breadcrumbs}

                    {/*<p>Current Information</p>*/}
                    {/*<ul>*/}
                    {/*    <li><AddressView {...user.addresses.find(address => address.id === shippingAddress)} /></li>*/}
                    {/*    <li><AddressView {...user.addresses.find(address => address.id === invoiceAddress)} /></li>*/}
                    {/*    <li>{paymentMethod}</li>*/}
                    {/*</ul>*/}

                    {step === 0 &&
                    <div>Anmeldung
                        {user.logged_in ?
                            <><p>Eingeloggt als {user.email}</p>
                                <Button label={"Ausloggen"} onClick={event => dispatch({type: USER.LOGOUT.REQUEST})}/>
                                <Button label={"Weiter zur Addresse"} onClick={() => changeStep(1)} primary
                                        disabled={!user.logged_in}/>
                            </>
                            :
                            <>
                                <LoginForm/>
                                <Button label={"Als Gast fortfahren"} onClick={() => changeStep(1)}/>
                            </>
                        }
                    </div>

                    }
                    {step === 1 && addressSection}
                    {step === 2 && paymentSection}
                    {step === 3 && checkSection}
                </div>
                <div className={"col-xs-6"}>
                    <BasketListing/>
                </div>
            </Row>

        </Container>

    );
};

export default Checkout;