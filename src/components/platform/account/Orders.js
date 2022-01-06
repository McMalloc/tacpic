import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ORDER} from "../../../actions/action_constants";
import * as moment from "moment";
import {useTranslation} from "react-i18next";
import {Alert} from "../../gui/Alert";
import {DB_DATE_FORMAT} from "../../../config/constants";
import Well from "../../gui/Well";
import {groupBy} from "lodash";
import downloadFile from "../../../utility/downloadFile";


const Orders = () => {
    const dispatch = useDispatch();
    const orders = groupBy(useSelector(state => state.user.orders), 'id') || {};
    const {t} = useTranslation();

    useEffect(() => {
        dispatch({
            type: ORDER.INDEX.REQUEST
        })
    }, []);

    if (orders.length === 0) return <Alert info>{t('account:orderMenu.noOrders')}</Alert>;

    return (
        <section>
            <Well>
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
                    {Object.keys(orders).map(order_id => {
                        let order = orders[order_id];
                        console.log(order);
                        return <tr key={order_id}>
                            <td>
                                {moment(order[0].created_at, DB_DATE_FORMAT).format(t('dateFormat'))}
                            </td>
                            <td>
                                {t('{{amount, currency}}', {amount: order[0].total_gross})}
                            </td>
                            <td>
                                {t('commerce:' + order[0].payment_method)}
                                {order.map((o, index) => {
                                    return <div>
                                        <a href={'#'} onClick={() => {
                                            fetch(`/api/invoices/${o.id}/pdf`, {
                                                method: 'GET',
                                                headers: {
                                                    'Authorization': "Bearer " + localStorage.getItem('jwt')
                                                }
                                            }).then(response => {
                                                return response.blob();
                                            }).then(data => {
                                                downloadFile(data, o.invoice_number + '.pdf');
                                            });
                                        }
                                        }>
                                            <small>{o.invoice_number}</small></a>

                                    </div>
                                })}
                            </td>
                            <td>
                                {t('account:order-status-' + order[0].status)}
                            </td>
                            <td>
                                {/*<a href={`http://${window.location.hostname}:9292/orders/${order.order_id}/invoice_file`}>Rechnung runterladen</a>&emsp;*/}
                                {/*<Button icon={'times'} >Stornieren</Button>*/}
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </Well>
        </section>

    );
};

export default Orders;