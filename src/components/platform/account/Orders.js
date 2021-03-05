import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ORDER} from "../../../actions/action_constants";
import * as moment from "moment";
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

    if (orders.length === 0) return <Alert info>{t('account:orderMenu.noOrders')}</Alert>;

    return (
        <section>
            <table>
                <thead>
                <td>{t('account:orderMenu.placedAt')}</td>
                <td>{t('account:orderMenu.sum')}</td>
                <td>{t('commerce:paymentMethod')}</td>
                <td>{t('account:orderMenu.state')}</td>
                <td></td>
                </thead>
                {orders.map(order => {
                    return <tr>
                        <td>
                            {moment(order.created_at, DB_DATE_FORMAT).format("DD.MM.yyyy")}
                        </td>
                        <td>
                            {t('{{amount, currency}}', {amount: order.total_gross})}
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