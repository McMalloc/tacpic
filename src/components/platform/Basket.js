import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "../gui/Button";
import {useTranslation} from "react-i18next";
import {template} from "lodash";
import {ORDER, VARIANTS} from "../../actions/action_constants";
import BasketListing from "./BasketListing";
import {Link, NavLink} from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import {Icon} from "../gui/_Icon";

const Basket = props => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const basket = useSelector(state => state.catalogue.basket);

    if (basket.length === 0) return (
        <CenterWrapper>
            <p><Icon icon={'empty-set fa-3x'} /></p>
            <p>Keine Artikel im Warenkorb.<br /><NavLink to={'/'}>Zurück zur Startseite.</NavLink></p>
        </CenterWrapper>
    );

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-md-6 col-md-offset-3 col-xs-12"}>
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