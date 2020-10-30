import styled, {useTheme} from 'styled-components/macro';
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import Tile from "../gui/_Tile";
import {Icon} from "../gui/_Icon";
import {NavLink} from "react-router-dom";
import {ORDER_RESET} from "../../actions/action_constants";

const OrderCompleted = props => {
    const {t} = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const order = useSelector(
        state => state.catalogue.order
    );
    const navigate = useNavigate();

    useEffect(() => {
        return () => dispatch({type: ORDER_RESET})
    }, [])
    if (order.key === null) navigate('/account/orders');

    return (
        <CenterWrapper>
            <h1>Vielen Dank für Ihre Bestellung!</h1>
            <Icon icon={'check-circle fa-3x'} />
            <p>Wir haben Ihnen eine Bestellübersicht per E-Mail geschickt.</p>
            <p>
                <NavLink to={"/"}>
                    Zurück zur Startseite
                </NavLink>
                &emsp;|&emsp;
                <NavLink to={"/account/orders"}>
                    Bestellungen einsehen
                </NavLink>
            </p>
        </CenterWrapper>
    )
};

export {OrderCompleted}