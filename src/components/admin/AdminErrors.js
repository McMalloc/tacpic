import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useTable} from 'react-table';
import styled from 'styled-components/macro';
import {ADMIN} from '../../actions/action_constants';
import Modal from '../gui/Modal';
import * as moment from "moment";
import {DB_DATE_FORMAT} from "../../config/constants";

// TODO: Minimieren-Button
const Wrapper = styled.div`
  table td {
    font-family: monospace;
    white-space: pre;
    font-size: 0.8rem;
  }
`;

const Row = styled.tr`
  &:nth-child(odd) {
    background-color: ${({theme}) => theme.grey_5};
    &:hover {
      background-color: ${({theme}) => theme.grey_6};
    }
  }
  cursor: pointer;
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
                .filter(col => {
                    return col !== 'backtrace' && col !== 'user_agent' && col !== 'params'
                })
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

    console.log(columns)


    const tableInstance = useTable({columns, data: memoedErrors})
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
        <>
            <Wrapper>
                <table {...getTableProps()}>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, index) => {
                        prepareRow(row)
                        console.log(errors[index])
                        return (
                            <Row onClick={() => setModalContent(errors[index])} {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </Row>
                        )
                    })}
                    </tbody>
                </table>
            </Wrapper>
            {modalContent !== null &&
            <Modal fitted dismiss={() => setModalContent(null)} actions={[
                {
                    label: "OK",
                    align: "right",
                    disabled: false,
                    action: () => {
                        setModalContent(null)
                    }
                }
            ]} title={"Details"}>
                <Pre>
                    {Object.keys(modalContent).map(key => {
                        return <><strong>{key}:</strong><br/>{modalContent[key]}<br/><br/></>
                    })}
                </Pre>

            </Modal>
            }
        </>
    )
};

export default AdminErrors;