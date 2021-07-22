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
import {Pre} from "../gui/Pre";

// TODO: Minimieren-Button
const Wrapper = styled.div`
    width: 100%;
`;

const AdminLogs = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: ADMIN.LOG_INDEX.REQUEST })
    }, [])

    const [modalContent, setModalContent] = useState(null);
    const logfiles = useSelector(state => state.admin.logfiles) || [];
    const currentLogfile = useSelector(state => state.admin.currentLogfile);
    const memoedLogfiles = useMemo(() => logfiles, [logfiles.length]);

    const columns = React.useMemo(() => [
        {
            Header: 'Datei',
            accessor: 'name'
        },
        {
            Header: 'Datum',
            accessor: 'createdAt',
            Cell: props => moment(props.value, DB_DATE_FORMAT).format(t('dateFormat'))
        },
        {
            Header: 'Dateigröße',
            accessor: 'size',
            Cell: props => (props.value/1000) + 'K'
        }
    ], [memoedLogfiles.length]);

    if (!logfiles || logfiles.length === 0) return <Loader />

    return (
        <Wrapper>
            <Datagrid columns={columns} data={memoedLogfiles} onRowClick={(row, index) => {
                dispatch({type: ADMIN.LOG.REQUEST, payload: {name: row.name}});
                setModalContent(row.name);
            }}/>

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
            ]} title={`Logfile Details`}>
                <Pre>
                    {currentLogfile}
                </Pre>

            </Modal>
            }
        </Wrapper>
    )
};

export default AdminLogs;