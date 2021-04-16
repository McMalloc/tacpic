import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useTable } from 'react-table';
import styled from 'styled-components/macro';
import { ADMIN } from '../../actions/action_constants';

// TODO: Minimieren-Button
const Wrapper = styled.div`

`;

const AdminErrors = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: ADMIN.FRONTEND_ERRORS.REQUEST })
        dispatch({ type: ADMIN.BACKEND_ERRORS.REQUEST })
    }, []);

    const backendErrors = useSelector(state => state.admin.backendErrors);
    const memoedBackendErrors = useMemo(() => backendErrors, [backendErrors.length]);
    const frontendErrors = useSelector(state => state.admin.frontendErrors);
    const memoedFrontendErrors = useMemo(() => frontendErrors, [frontendErrors.length]);

    const columns = React.useMemo(() => {
        if (memoedBackendErrors.length === 0 || !memoedBackendErrors[0]) {
            return []
        } else {
            return Object.keys(memoedBackendErrors[0]).map(key => ({
                Header: t(key),
                accessor: key
            }))
        }
    }, [memoedBackendErrors.length]);


    const tableInstance = useTable({ columns, data: memoedBackendErrors })
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
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
                    {rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            <div style={{ maxWidth: 250, maxHeight: 200, overflow: 'auto' }}>
                                                {cell.render('Cell')}
                                            </div>

                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Wrapper>
    )
};

export default AdminErrors;