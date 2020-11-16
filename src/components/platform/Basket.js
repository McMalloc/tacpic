import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {useTranslation} from "react-i18next";
import {QUOTE} from "../../actions/action_constants";
import BasketListing from "./BasketListing";
import {Link, NavLink, Navigate} from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import {Icon} from "../gui/_Icon";
import {MAX_VALUE_FOR_ORDER} from "../../config/constants";
import {Alert} from "../gui/Alert";
import {Multiline, Textinput} from "../gui/Input";
import {Checkbox} from "../gui/Checkbox";

const requestQuote = (dispatch, quoteComment, basket, emailCopy) => {
    dispatch({
        type: QUOTE.REQUEST.REQUEST,
        payload: {comment: quoteComment, basket, emailCopy}
    })
}

// TODO auslagern
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const layout = "col-xs-12 col-sm-12 col-md-8 col-md-offset-2 col-lg-4 col-lg-offset-4 ";

const Basket = props => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const basket = useSelector(state => state.catalogue.basket);
    const quote = useSelector(state => state.catalogue.quote);

    const [quoteComment, setQuoteComment] = useState(null)
    const [email, setEmail] = useState(null)
    const [emailCopy, setEmailCopy] = useState(false)
    const [emailValid, setEmailValid] = useState(false)

    if (basket.length === 0) return (
        <CenterWrapper>
            <p><Icon icon={'empty-set fa-3x'}/></p>
            <p>Keine Artikel im Warenkorb.<br/><NavLink to={'/'}>Zurück zur Startseite.</NavLink></p>
        </CenterWrapper>
    );

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={layout}>
                    <h1>Warenkorb</h1>
                    <BasketListing/>
                    {quote.gross_total > MAX_VALUE_FOR_ORDER ?
                        <>
                            {quote.successfull ?
                                <p>Vielen Dank! Wir werden Ihre Anfrage schnellstmöglich bearbeiten.</p>
                                :
                                <div>
                                    <Alert info>
                                        <p>Die Bestellung ist leider so groß, dass wir eine fristgerechte Produktion nicht garantieren können.</p>
                                        <p>...</p>
                                    </Alert>
                                    <Multiline value={quoteComment} onChange={event => setQuoteComment(event.target.value)} label={"Anmerkungen"} />
                                    {user.logged_in ?
                                        <Checkbox value={emailCopy} onChange={() => setEmailCopy(!emailCopy)} label={"Eine Kopie der Anfrage an meine E-Mail-Adresse senden"} />
                                        :
                                        <Textinput
                                            value={email}
                                            label={t("general:email")}
                                            sublabel={t("general:Wir benötigen eine E-Mail-Adresse, damit wir uns zurückmelden können.")}
                                            autocomplete={"username"}
                                            required
                                            validations={[
                                                {fn: val => emailRegex.test(val), message: "general:email-invalid", callback: setEmailValid}
                                            ]}
                                            onChange={event => setEmail(event.target.value)}
                                            name={'uname'}/>
                                    }
                                    <div style={{textAlign: 'center', margin: '12px 0'}}>
                                        <Button icon={"question"} disabled={!(emailValid || user.logged_in) || quote.pending}
                                                onClick={() => requestQuote(dispatch, quoteComment, basket, emailCopy)} label={t("commerce:Angebot erbitten")} primary large />
                                    </div>
                                </div>
                            }
                        </>
                        :
                        <div style={{textAlign: 'center', margin: '12px 0'}}>
                            <Link className={"no-styled-link"} to="/checkout">
                                <Button icon={"arrow-right"} label={t("commerce:Zur Kasse gehen")} primary large />
                            </Link>
                        </div>
                    }

                </div>
            </div>


        </div>

    );
};

export default Basket;