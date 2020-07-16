import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {useTranslation} from "react-i18next";
import {template} from "lodash";
import {ORDER, VARIANTS} from "../../actions/action_constants";
import BasketListing from "./BasketListing";
import {Link} from "react-router-dom";

const Basket = props => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src = "https://static.heidelpay.com/v1/heidelpay.js";
    //     script.async = true;
    //     script.onload = () => setTimeout(processPaymentForm, 1000);
    //
    //     // document.body.appendChild(script);
    // }, []);

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-md-12"}>
                    <h1>Warenkorb</h1>
                    {/*<p>{template(t("commerce:total"))({amount: 3})}</p>*/}
                    <BasketListing />
                    <div style={{textAlign: 'center', margin: '12px 0'}}>
                    <Link to="/checkout">
                        <Button icon={"arrow-right"} label={t("commerce:Zur Kasse gehen")} primary large />
                    </Link>
                    </div>
                </div>
            </div>


        </div>

    );
};

export default Basket;