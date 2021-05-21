import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useTable, useSortBy, useFilters} from 'react-table';
import styled from "styled-components/macro";
import {Textinput} from "./Input";

const Row = styled.tr`
  &:nth-child(odd) {
    background-color: ${({theme}) => theme.grey_5};

    &:hover {
      background-color: ${({theme}) => theme.grey_6};
    }
  }

  cursor: pointer;
`;

function DefaultColumnFilter({column: {filterValue, preFilteredRows, setFilter}}) {
    return (
        <Textinput value={filterValue || ''}
                   onChange={e => {
                       setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                   }}/>
    )
}

const Datagrid = props => {
    const {t} = useTranslation();

    const memoedData = useMemo(() => props.data, [props.data.length]);

    const memoedColumns = React.useMemo(() => !!props.columns ? props.columns : Object
        .keys(memoedData[0])
        .filter(col => {
            return col !== 'backtrace' && col !== 'user_agent' && col !== 'params'
        })
        .map(key => ({
            Header: t(key),
            accessor: key
        })), [props.columns.length]);


    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            // fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )


    const tableInstance = useTable(
        {
            columns: memoedColumns,
            data: memoedData,
            defaultColumn,
            filterTypes
        },
        useFilters,
        useSortBy
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <div>{column.render('Filter')}</div>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                    prepareRow(row)
                    return (
                        <Row onClick={() => {
                            props.onRowClick(row.values, index)
                        }} {...row.getRowProps()}>
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
        </>
    )
};

export default Datagrid;