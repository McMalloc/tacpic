import React, {useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {ADMIN} from "../../actions/action_constants";
import * as moment from "moment";
import {DB_DATE_FORMAT} from "../../config/constants";
import Datagrid from "../gui/Datagrid";
import Modal from "../gui/Modal";
import Loader from "../gui/Loader";
import ServerError from "../platform/ServerError";

// TODO: Minimieren-Button
const Wrapper = styled.div`
    width: 100%;
`;

const AdminVouchers = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: ADMIN.VOUCHER_INDEX.REQUEST })
        document.title = "Internetmarken | tacpic";
    }, [])

    const [modalContent, setModalContent] = useState(null);
    const vouchers = useSelector(state => state.admin.vouchers);
    const vouchersPending = useSelector(state => state.admin.vouchersPending);
    const vouchersError = useSelector(state => state.admin.vouchersError);
    const memoedVouchers = useMemo(() => vouchers, [vouchers.length]);

    const columns = React.useMemo(() => {
        if (memoedVouchers.length === 0 || !memoedVouchers[0]) {
            return []
        } else {
            return Object
                .keys(memoedVouchers[0])
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
    }, [memoedVouchers.length]);

    if (vouchersPending) return <Loader />
    return (
        <Wrapper>
            <Datagrid columns={columns} data={memoedVouchers} onRowClick={(row, index) => {
                // dispatch({type: ORDER_ADMIN.RPC.REQUEST, payload: {id: row.id, method: 'resend_order_confirmation'}});
                // setModalContent(row);
                fetch(`/api/internal/vouchers/${row.voucher_id}/png`, {
                    headers: {
                        'Authorization': "Bearer " + localStorage.getItem('jwt')
                    }
                }).then(response => response.blob())
                    .then(blob => setModalContent(URL.createObjectURL(blob)))
            }} />
            {!!modalContent &&
            <Modal fitted dismiss={() => setModalContent(null)} actions={[
                {
                    label: "Fertig",
                    align: "right",
                    disabled: false,
                    action: () => {
                        setModalContent(null)
                    }
                }
            ]} title={`Marke -- Details`}>
                <>
                    <img src={modalContent} />
                </>

            </Modal>
            }
        </Wrapper>
    )
};

export default AdminVouchers;