import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/macro';
import {ADMIN} from '../../actions/action_constants';
import Modal from '../gui/Modal';
import * as moment from "moment";
import {DB_DATE_FORMAT} from "../../config/constants";
import Datagrid from "../gui/Datagrid";

// TODO: Minimieren-Button
const Wrapper = styled.div`
  table td {
    font-family: monospace;
    white-space: pre;
    font-size: 0.8rem;
  }
`;

const Pre = styled.pre`
  white-space: pre-wrap;
  font-size: 0.8rem;
  padding: 0.5rem;
  background-color: ${({theme}) => theme.grey_6};
`;

const AdminErrors = props => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        props.frontend && dispatch({type: ADMIN.FRONTEND_ERRORS.REQUEST})
        props.backend && dispatch({type: ADMIN.BACKEND_ERRORS.REQUEST})
    }, []);

    const errors = useSelector(state => props.frontend ? state.admin.frontendErrors : props.backend ? state.admin.backendErrors : []);
    const memoedErrors = useMemo(() => errors, [errors.length]);

    const [modalContent, setModalContent] = useState(null);

    const columns = React.useMemo(() => {
        if (memoedErrors.length === 0 || !memoedErrors[0]) {
            return []
        } else {
            return Object
                .keys(memoedErrors[0])
                .map(key => {
                    let col = {
                        Header: t(key),
                        accessor: key
                    }
                    if (key === 'message') {
                        col.Cell = props => !!props.value ? props.value.substring(0, 20) + '...' : 'n/a'
                    }
                    if (key === 'created_at') {
                        col.Cell = props => moment(props.value, DB_DATE_FORMAT).format(t('dateFormat'))
                    }

                    return col
                })
        }
    }, [memoedErrors.length]);

    const options = {};

    return <Wrapper>
        <Datagrid columns={columns} data={errors} options={options}
                  onCellClick={(cell, rowIndex, colIndex) => console.log(cell, rowIndex, colIndex)}
                  onRowClick={(row, index) => setModalContent(row)} />

        {modalContent !== null &&
        <Modal fitted dismiss={() => setModalContent(null)} actions={[
            {
                label: "Fertig",
                align: "right",
                disabled: false,
                action: () => {
                    setModalContent(null)
                }
            }
        ]} title={"Details"}>
            <Pre>
                {Object.keys(modalContent).map(key => {
                    return <><br/><br/><strong>{key}:</strong><br/>{modalContent[key]}</>
                })}
            </Pre>

        </Modal>
        }
    </Wrapper>
};

export default AdminErrors;