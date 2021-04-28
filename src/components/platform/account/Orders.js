import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ORDER } from "../../../actions/action_constants";
import * as moment from "moment";
import { useTranslation } from "react-i18next";
import { Alert } from "../../gui/Alert";
import { DB_DATE_FORMAT } from "../../../config/constants";


const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.user.orders) || [];
    const { t } = useTranslation();

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
                    <tr>
                        <th>{t('account:orderMenu.placedAt')}</th>
                        <th>{t('account:orderMenu.sum')}</th>
                        <th>{t('commerce:paymentMethod')}</th>
                        <th>{t('account:orderMenu.state')}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => {
                        return <tr key={order.id}>
                            <td>
                                {moment(order.created_at, DB_DATE_FORMAT).format(t('dateFormat'))}
                            </td>
                            <td>
                                {t('{{amount, currency}}', { amount: order.total_gross })}
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
                </tbody>
            </table>
        </section>

    );
};

export default Orders;