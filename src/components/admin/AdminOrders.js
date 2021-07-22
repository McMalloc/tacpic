import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/macro';
import {ORDER_ADMIN} from "../../actions/action_constants";
import * as moment from "moment";
import {DB_DATE_FORMAT} from "../../config/constants";
import Datagrid from "../gui/Datagrid";
import Modal from "../gui/Modal";
import Loader from "../gui/Loader";
import ServerError from "../platform/ServerError";
import AddressView from "../platform/AddressView";
import Tile from "../gui/_Tile";
import Well from "../gui/Well";
import ElementGrid from "../gui/ElementGrid";
import {API_URL} from "../../env.json";
import Badge from "../gui/Badge";
import {Checkbox} from "../gui/Checkbox";
import {Button} from "../gui/Button";
import {Alert} from "../gui/Alert";

const Wrapper = styled.div`
  width: 100%;
`;

const AdminOrders = props => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({type: ORDER_ADMIN.INDEX.REQUEST})
        document.title = "Bestellungen | tacpic";
    }, [])

    const [modalContent, setModalContent] = useState(null);
    const orders = useSelector(state => state.admin.orders);
    const currentOrder = useSelector(state => state.admin.currentOrder);
    const currentOrderPending = useSelector(state => state.admin.currentOrderPending);
    const currentOrderError = useSelector(state => state.admin.currentOrderError);
    const memoedOrders = useMemo(() => orders, [orders.length]);

    const [invoiceCorrect, setInvoiceCorrect] = useState(true)

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

    if (orders.length === 0) return <Loader/>
    return (
        <Wrapper>
            <Datagrid columns={columns} data={memoedOrders} onRowClick={(row, index) => {
                dispatch({type: ORDER_ADMIN.GET.REQUEST, payload: {id: row.id}});
                setInvoiceCorrect(true);
                setModalContent(row);
            }}/>
            {!!modalContent &&
            <Modal tinted fitted dismiss={() => setModalContent(null)} actions={[
                {
                    label: "Fertig",
                    align: "right",
                    disabled: false,
                    action: () => {
                        setModalContent(null)
                    }
                }
            ]} title={`Bestellung #${modalContent.id} -- Details`}>

                {currentOrderPending ? <Loader/> : !!currentOrderError ? <ServerError error={currentOrderError}/> :
                    <div className={'container'}>
                        <p>{moment(currentOrder.order.created_at).format(t('dateFormat'))}</p>
                        <p>
                            Status: <Badge state={currentOrder.order.status === 3 ? 'success' : null}>
                            {t('account:order-status-' + currentOrder.order.status)}
                        </Badge>
                        </p>
                        <div className={'row'}>
                            <div className={'col-md-6'}>
                                <h3>Rechnungen</h3>
                                {currentOrder.invoices.length === 0 ?
                                    <p className={'disabled'}>keine angelegt</p>
                                    :
                                    <>
                                        {currentOrder.invoices.reverse().map(invoice => {
                                            if (!!invoice.voucher_id) {
                                                fetch(`/api/internal/vouchers/${invoice.voucher_id}/png`, {
                                                    headers: {
                                                        'Authorization': "Bearer " + localStorage.getItem('jwt')
                                                    }
                                                }).then(response => response.blob())
                                                    .then(blob => {
                                                        let imgElem = document.getElementById('voucher-preview-' + invoice.id);
                                                        if (!!imgElem) imgElem.src = URL.createObjectURL(blob)
                                                    })
                                            }

                                            return <Well key={invoice.id}>
                                                <ElementGrid>
                                                    <div>
                                                        {invoice.status === 4 ?
                                                            <span>&times; [storniert] {invoice.invoice_number}</span>
                                                        :
                                                            <strong>{invoice.invoice_number}</strong>
                                                        }
                                                        <br/>
                                                        vom {moment(invoice.created_at).format(t('dateFormat'))}
                                                    </div>
                                                    <div>
                                                        <strong>An:</strong><br/>
                                                        <AddressView {...currentOrder.user.addresses.find(addr => addr.id === invoice.address_id)}/>
                                                    </div>

                                                    {!!invoice.voucher_id ?
                                                    <div>
                                                        <img alt={invoice.voucher_id} style={{width: 200}} id={'voucher-preview-' + invoice.id}/>
                                                        <small>Marken-ID: {invoice.voucher_id}</small>
                                                    </div>
                                                        :
                                                        <Button disabled={!invoice.address_id} onClick={() => {
                                                            fetch(`/api/internal/orders/${currentOrder.order.id}/rpc`, {
                                                                method: 'POST',
                                                                body: JSON.stringify({
                                                                    method: 'purchase_invoice_voucher',
                                                                    invoice_id: invoice.id
                                                                }),
                                                                headers: {
                                                                    'Authorization': "Bearer " + localStorage.getItem('jwt'),
                                                                    'Content-Type': 'application/json'
                                                                }
                                                            }).then(response => {
                                                                setInvoiceCorrect(true);
                                                                dispatch({type: ORDER_ADMIN.GET.REQUEST, payload: {id: currentOrder.order.id}});
                                                            });
                                                        }
                                                        }>Marke lösen</Button>
                                                    }

                                                </ElementGrid>
                                            </Well>
                                        })}
                                    </>
                                }
                            </div>
                            <div className={'col-md-6'}>
                                <h3>Positionen</h3>
                                {currentOrder.order_items.length === 0 ?
                                    <p className={'disabled'}>keine angelegt</p>
                                    :
                                    <>
                                        {currentOrder.order_items.map(item => {
                                            return <Well key={item.id}>
                                                <ElementGrid>
                                                    <div>
                                                        {item.quantity}&times; {item.current_file_name}
                                                        <br/>
                                                        Einzelpreis: {t('{{amount, currency}}', {amount: item.gross_price})}<br/>

                                                        <strong>
                                                            {t('{{amount, currency}}', {amount: item.gross_price * item.quantity})}
                                                        </strong>

                                                    </div>
                                                    <img style={{width: 200}}
                                                         src={`${API_URL}/thumbnails/${item.current_file_name}-THUMBNAIL-sm-p0.png`}/>

                                                </ElementGrid>
                                            </Well>
                                        })}
                                    </>
                                }
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-md-6'}>
                                <>
                                    <Checkbox value={invoiceCorrect}
                                              onChange={() => setInvoiceCorrect(!invoiceCorrect)}
                                              label={'Die Rechnung ist korrekt'}/>
                                    {!invoiceCorrect &&
                                    <Alert danger>
                                        <ElementGrid>
                                            <>Das Anlegen einer neuen Rechnung verpflichtet uns dazu, diese als gültig für diesen Auftrag zu deklarieren, und die zuletzt gültige zu invalidieren.</>
                                            <Button dangerous onClick={() => {
                                                fetch(`/api/internal/orders/${currentOrder.order.id}/rpc`, {
                                                    method: 'POST',
                                                    body: JSON.stringify({method: 'correct_invoice'}),
                                                    headers: {
                                                        'Authorization': "Bearer " + localStorage.getItem('jwt'),
                                                        'Content-Type': 'application/json'
                                                    }
                                                }).then(response => {
                                                    setInvoiceCorrect(true);
                                                    dispatch({type: ORDER_ADMIN.GET.REQUEST, payload: {id: currentOrder.order.id}});
                                                });
                                            }}>Neue Rechnung anlegen</Button>
                                        </ElementGrid>
                                    </Alert>}
                                </>

                            </div>
                        </div>
                    </div>

                }

            </Modal>
            }
        </Wrapper>
    )
}
;

export default AdminOrders;