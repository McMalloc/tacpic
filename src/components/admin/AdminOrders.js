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
import downloadFile from "../../utility/downloadFile";

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

        const [invoiceCorrect, setInvoiceCorrect] = useState(null);

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
                    setInvoiceCorrect(null);
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
                                <p>{moment(currentOrder.order.created_at, DB_DATE_FORMAT).format(t('dateFormat'))}</p>
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
                                                {currentOrder.invoices.map(invoice => {
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
                                                        {invoice.status === 6 &&
                                                            <div><Badge state={'warning'}>gutgeschrieben</Badge></div>}
                                                        {invoice.status === 5 &&
                                                            <div><Badge state={'warning'}>storniert</Badge></div>}
                                                        <ElementGrid>
                                                            <div>
                                                                <strong>{invoice.invoice_number}</strong>
                                                                <br/>
                                                                vom {moment(invoice.created_at, DB_DATE_FORMAT).format(t('dateFormat'))}
                                                                <br/>
                                                                <Button disabled={!invoice.address_id} onClick={() => {
                                                                    fetch(`/api/invoices/${invoice.id}/pdf`, {
                                                                        method: 'GET',
                                                                        headers: {
                                                                            'Authorization': "Bearer " + localStorage.getItem('jwt')
                                                                        }
                                                                    }).then(response => {
                                                                        return response.blob();
                                                                    }).then(data => {
                                                                        downloadFile(data, invoice.invoice_number + '.pdf');
                                                                    });
                                                                }
                                                                }>Herunterladen</Button>

                                                            </div>
                                                            <div>
                                                                <strong>An:</strong><br/>
                                                                <AddressView {...currentOrder.user.addresses.find(addr => addr.id === invoice.address_id)}/>
                                                            </div>

                                                            {!!invoice.voucher_id ?
                                                                <>
                                                                    <div>
                                                                        <img alt={invoice.voucher_id} style={{
                                                                            width: 200,
                                                                            border: '1px solid lightgrey'
                                                                        }} id={'voucher-preview-' + invoice.id}/>
                                                                    </div>
                                                                    <div>
                                                                        <small>Marken-ID: {invoice.voucher_id}</small>
                                                                    </div>
                                                                </>
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
                                                                        setInvoiceCorrect(null);
                                                                        dispatch({
                                                                            type: ORDER_ADMIN.GET.REQUEST,
                                                                            payload: {id: currentOrder.order.id}
                                                                        });
                                                                    });
                                                                }
                                                                }>Marke lösen</Button>
                                                            }


                                                        </ElementGrid>
                                                        <hr/>

                                                        <Checkbox value={invoiceCorrect === invoice.id}
                                                                  name={'invoice-correction-' + invoice.id}
                                                                  onChange={() => setInvoiceCorrect(!invoiceCorrect ? invoice.id : null)}
                                                                  label={'Die Rechnung muss korrigiert werden'}/>
                                                        {invoiceCorrect === invoice.id &&
                                                            <>
                                                                <Button disabled={!invoice.address_id} onClick={() => {
                                                                    fetch(`/api/internal/orders/${currentOrder.order.id}/rpc`, {
                                                                        method: 'POST',
                                                                        body: JSON.stringify({
                                                                            method: 'cancel_invoice',
                                                                            invoice_id: invoice.id
                                                                        }),
                                                                        headers: {
                                                                            'Authorization': "Bearer " + localStorage.getItem('jwt'),
                                                                            'Content-Type': 'application/json'
                                                                        }
                                                                    }).then(response => {
                                                                        // setInvoiceCorrect(true);
                                                                        dispatch({
                                                                            type: ORDER_ADMIN.GET.REQUEST,
                                                                            payload: {id: currentOrder.order.id}
                                                                        });
                                                                        setInvoiceCorrect(null)
                                                                    });
                                                                }
                                                                }>Stornieren</Button>&emsp;

                                                                <Button dangerous onClick={() => {
                                                                    fetch(`/api/internal/orders/${currentOrder.order.id}/rpc`, {
                                                                        method: 'POST',
                                                                        body: JSON.stringify({method: 'correct_invoice', invoice_id: invoice.id}),
                                                                        headers: {
                                                                            'Authorization': "Bearer " + localStorage.getItem('jwt'),
                                                                            'Content-Type': 'application/json'
                                                                        }
                                                                    }).then(response => {
                                                                        setInvoiceCorrect(null);
                                                                        dispatch({
                                                                            type: ORDER_ADMIN.GET.REQUEST,
                                                                            payload: {id: currentOrder.order.id}
                                                                        });
                                                                    });
                                                                }}>Stornorechnung anlegen</Button></>}
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
                            </div>

                        }

                    </Modal>
                }
            </Wrapper>
        )
    }
;

export default AdminOrders;