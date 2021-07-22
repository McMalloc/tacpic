import React, { useEffect } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CenterWrapper from "../gui/_CenterWrapper";
import { Icon } from "../gui/_Icon";
import { NavLink } from "react-router-dom";
import { ORDER_RESET } from "../../actions/action_constants";

const OrderCompleted = props => {
    const dispatch = useDispatch();
    const completedOrder = useSelector(
        state => state.catalogue.order.response
    );
    const navigate = useNavigate();

    useEffect(() => {
        return () => dispatch({ type: ORDER_RESET })
    }, [])


    if (completedOrder === null) {
        setTimeout(() => navigate('/account/orders'))
        return null;
    }

    return (
        <CenterWrapper>
            <Trans i18nKey={completedOrder.status === 2 ? 'commerce:orderSuccessfull' : 'commerce:orderReceived'}>
                <h1>0</h1>
                <Icon icon={completedOrder.status === 2 ? 'check-circle fa-3x' : 'clock fa-3x'} />
                <p>
                    
                </p>
                <NavLink to={"/"} />
                <NavLink to={"/account/orders"} />
            </Trans>
        </CenterWrapper>
    )
};

export { OrderCompleted }