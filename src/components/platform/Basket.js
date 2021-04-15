import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../gui/Button";
import { useTranslation } from "react-i18next";
import { QUOTE } from "../../actions/action_constants";
import BasketListing from "./BasketListing";
import { Link, NavLink, Navigate } from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import { Icon } from "../gui/_Icon";
import { MAX_VALUE_FOR_ORDER } from "../../config/constants";
import { Alert } from "../gui/Alert";
import { Multiline, Textinput } from "../gui/Input";
import { Checkbox } from "../gui/Checkbox";

const requestQuote = (dispatch, quoteComment, basket, emailCopy) => {
    dispatch({
        type: QUOTE.REQUEST.REQUEST,
        payload: { comment: quoteComment, basket, emailCopy }
    })
}

// TODO auslagern
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const layout = "col-xs-12 col-sm-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3";

const Basket = props => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const basket = useSelector(state => state.catalogue.basket);
    const quote = useSelector(state => state.catalogue.quote);

    const [quoteComment, setQuoteComment] = useState(null)
    const [email, setEmail] = useState(null)
    const [emailCopy, setEmailCopy] = useState(false)
    const [emailValid, setEmailValid] = useState(false)

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={layout}>
                    <h1>{t('commerce:basketHeading')}</h1>
                    {basket.length === 0 ?
                        <CenterWrapper>
                            <p><Icon icon={'empty-set fa-3x'} /></p>
                            <p>{t('commerce:noArticles')}<br />
                                <NavLink to={'/'}>{t('backToStart')}</NavLink></p>
                        </CenterWrapper>
                        :
                        <>
                            <BasketListing />
                            {quote.gross_total > MAX_VALUE_FOR_ORDER ?

                                    <Alert warning>
                                                {t('commerce:orderTooLargeHint')}
                                            </Alert>
                                            
                                :
                                <div style={{ textAlign: 'center', margin: '12px 0' }}>
                                    <Link className={"no-styled-link"} to="/checkout">
                                        <Button icon={"arrow-right"} label={t("commerce:toCheckout")} primary large />
                                    </Link>
                                </div>
                            }
                        </>

                    }



                </div>
            </div>


        </div>

    );
};

export default Basket;