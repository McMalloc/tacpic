import React, {useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {ADMIN, ORDER_ADMIN} from "../../actions/action_constants";
import * as moment from "moment";
import {DB_DATE_FORMAT} from "../../config/constants";
import Datagrid from "../gui/Datagrid";
import Modal from "../gui/Modal";
import Loader from "../gui/Loader";

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

    const orders = useSelector(state => state.admin.orders) || [];
    const memoedOrders = useMemo(() => orders, [orders.length]);

    const columns = React.useMemo(() => {
        if (memoedOrders.length === 0 || !memoedOrders[0]) {
            return []
        } else {
            return Object
                .keys(memoedOrders[0])
                .map(key => {
                    let col = {
                        Header: t(key),
                        accessor: key
                    }
                    if (key === 'created_at') {
                        col.Cell = props => moment(props.value, DB_DATE_FORMAT).format(t('dateFormat'))
                    }

                    return col
                })
        }
    }, [memoedOrders.length]);
    if (orders.length === 0) return <Loader />
    return (
        <Wrapper>
            <Datagrid columns={columns} data={memoedOrders} />
        </Wrapper>
    )
};

export default AdminOrders;