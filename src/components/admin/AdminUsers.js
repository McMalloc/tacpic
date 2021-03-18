import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useTable } from 'react-table';
import styled from 'styled-components/macro';
import { USER } from '../../actions/action_constants';

// TODO: Minimieren-Button
const Wrapper = styled.div`

`;

const AdminUsers = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const users = useSelector(state => state.admin.users);
    const usersData = useMemo(() => users, [users.length]);

    const columns = React.useMemo(() => {
        if (usersData.length === 0 || !usersData[0]) {
            return []
        } else {
            console.log(Object.keys(usersData[0]));
            return Object.keys(usersData[0]).map(key => ({
                Header: t(key),
                accessor: key
            }))
        }
    }, [usersData.length]);


    const tableInstance = useTable({ columns, data: usersData })
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    useEffect(() => {
        dispatch({ type: USER.INDEX.REQUEST })
    }, []);

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
                                            {cell.render('Cell')}
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

export default AdminUsers;