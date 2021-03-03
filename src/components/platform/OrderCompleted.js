import styled, { useTheme } from 'styled-components/macro';
import React, { useEffect } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import { Icon } from "../gui/_Icon";
import { NavLink } from "react-router-dom";
import { ORDER_RESET } from "../../actions/action_constants";

const OrderCompleted = props => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const order = useSelector(
        state => state.catalogue.order
    );
    const navigate = useNavigate();

    useEffect(() => {
        return () => dispatch({ type: ORDER_RESET })
    }, [])
    // if (order.key === null) navigate('/account/orders');

    return (
        <CenterWrapper>
            <Trans i18nKey={'commerce:orderSuccessfull'}>
                <h1>0</h1>
                <Icon icon={'check-circle fa-3x'} />
                <p>
                    
                </p>
                <NavLink to={"/"} />
                <NavLink to={"/account/orders"} />
            </Trans>
        </CenterWrapper>
    )
};

export { OrderCompleted }