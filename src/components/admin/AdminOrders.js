import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {ORDER_ADMIN} from "../../actions/action_constants";

// TODO: Minimieren-Button
const Wrapper = styled.div`
    width: 100%;
`;

const AdminOrders = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: ORDER_ADMIN.INDEX.REQUEST })
    }, [])

    const orders = useSelector(state => state.admin.orders)

    return (
        <Wrapper>
            orders
        </Wrapper>
    )
};

export default AdminOrders;