import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ORDER} from "../../../actions/action_constants";
import styled from 'styled-components/macro';
import * as moment from "moment";
import {Currency} from "../../gui/Currency";
import {Button} from "../../gui/Button";
import {useTranslation} from "react-i18next";
import {Alert} from "../../gui/Alert";
import { DB_DATE_FORMAT } from "../../../config/constants";


const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.user.orders) || [];
    const {t} = useTranslation();

    useEffect(() => {
        dispatch({
            type: ORDER.INDEX.REQUEST
        })
    }, []);

    if (orders.length === 0) return <Alert info>Es sind bisher keine Bestellungen erfasst worden.</Alert>;

    return (
        <section>
            <table>
                <thead>
                <td>Erfolgt am</td>
                <td>Summe</td>
                <td>Zahlart</td>
                <td>Status</td>
                <td></td>
                </thead>
                {orders.map(order => {
                    return <tr>
                        <td>
                            {moment(order.created_at, DB_DATE_FORMAT).format("DD.MM.yyyy")}
                        </td>
                        <td>
                            <Currency normal amount={order.total_gross} />
                        </td>
                        <td>
                            {t('commerce:' + order.payment_method)}
                        </td>
                        <td>
                            {t('account:order-status-' + order.status)}
                        </td>
                        <td>
                            {/*<a href={`http://${window.location.hostname}:9292/orders/${order.order_id}/invoice_file`}>Rechnung runterladen</a>&emsp;*/}
                            {/*<Button icon={'times'} >Stornieren</Button>*/}
                        </td>
                    </tr>
                })}
            </table>
        </section>

    );
};

export default Orders;