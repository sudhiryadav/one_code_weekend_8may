import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import styled from 'styled-components'
import { connect } from 'react-redux';
import { getMembersRequest } from '../actions/members';
import { useAsyncDebounce, useFilters, useGlobalFilter, usePagination, useTable } from 'react-table';

import makeData from '../makeData';

// Define a default UI for filtering
const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter, }) => {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <span>
            <Input
                className="form-control"
                style={{ width: "100%" }}
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`Search ${count} records...`}
            />
        </span>
    )
}

// Used in case we need only the column filter.
const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter }, }) => {
    const count = preFilteredRows.length
    return (
        <Input
            className="form-control"
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
const Table = ({ columns, data, fetchData, loading, pageCount: controlledPageCount, deleteSelected, deleteRows, editRow, selectRow }) => {

    const {
        getTableProps,
        getTableBodyProps,
        preGlobalFilteredRows,
        headerGroups,
        prepareRow,
        page,
        rows,
        canPreviousPage,
        canNextPage,
        pageOptions,
        setGlobalFilter,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: { pageIndex, pageSize, globalFilter },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }, // Pass our hoisted table state
            manualPagination: true, // Tell the usePagination
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            pageCount: controlledPageCount,
        },
        useGlobalFilter,
        // useFilters,
        usePagination,
    )

    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({ pageIndex, pageSize })
    }, [fetchData, pageIndex, pageSize])

    // Render the UI for your table
    return (
        <>
            <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
            />
            <MaUTable {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.column.id === 'action' ?
                                                <>
                                                    <EditIcon style={{ cursor: 'pointer' }} onClick={() => editRow(row.id)} />
                                                    <DeleteIcon color="error" style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => deleteRows(row.id)} />
                                                </> :
                                                cell.column.id === 'select' ?
                                                    <Checkbox checked={row.checked} onChange={() => selectRow(row.id)} /> :
                                                    cell.render('Cell')}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                    <tr>
                        {loading ? (
                            // Use our custom loading state to show a loading indicator
                            <td colSpan="10000">Loading...</td>
                        ) : (
                            <td colSpan="10000">
                                Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                results
                            </td>
                        )}
                    </tr>
                </TableBody>
            </MaUTable>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <Button color="primary" variant="contained" startIcon={<DeleteIcon />} onClick={deleteSelected} >Delete Selected</Button>
                <div className="pagination">
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </button>{' '}
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>{' '}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>{' '}
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>{' '}
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <span>
                        | Go to page:{' '}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                    </span>{' '}
                    <select
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )
}

// Let's simulate a large dataset on the server (outside of our component)
// const serverData = makeData(10000)

const MembersOld = props => {

    const { getMembersRequest, members } = props;

    const columns = useMemo(
        () =>
            [
                {
                    Header: 'Select',
                    accessor: 'select',
                },
                {
                    Header: 'Id',
                    accessor: 'id',
                },
                {
                    Header: 'Name',
                    accessor: 'name',
                },
                {
                    Header: 'Email',
                    accessor: 'email',
                },
                {
                    Header: 'Role',
                    accessor: 'role',
                },
                {
                    Header: 'Action',
                    accessor: 'action',
                }
            ],
        []
    )

    // We'll start our table without any data
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0)
    const fetchIdRef = useRef(0)



    const editRow = id => {
        // show modal to edit the row.
        alert(`Modal with data to be edited with id ${id}`);
    }

    const deleteRows = id => {
        if (window.confirm('delete row?')) {
            setData(data.filter(d => d.id !== id))

        }
    }

    const deleteSelected = () => {
        if (window.confirm('delete row?')) {
            console.log("data.filter(d => !d['selected']).length")
            console.log(data.filter(d => !d['selected']).length)
            setData(data.filter(d => !d['selected']));
        } else {
            const tempData = Object.assign([], data);
            tempData.forEach(d => d['selected'] = false)
            setData(tempData)
        }
    }

    const selectRow = id => {
        // update the row with highlighting
        console.log(id)
        setData(data.map(d => {
            if (d.id === id) {
                d['selected'] = !d['selected'];
            }
            return d;
        }));
    }

    const fetchData = useCallback(({ pageSize, pageIndex }) => {
        const fetchId = ++fetchIdRef.current
        // Set the loading state
        setLoading(true)

        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current) {
            console.log('S: calling fetchData method', pageIndex, pageSize)

            const startRow = pageSize * pageIndex;
            const endRow = startRow + pageSize;
            const serverData = members.items;
            setData(serverData);
            // setData(serverData.slice(startRow, endRow))

            setPageCount(Math.ceil(serverData.length / pageSize))

            setLoading(false)
        }
    }, [])

    useEffect(() => {
        getMembersRequest();
    }, [getMembersRequest]);

    return (
        <div style={{ margin: 'auto', width: 1000 }}>
            <h2 style={{ marginTop: 0 }}>Members</h2>
            <Table
                columns={columns}
                data={data}
                fetchData={fetchData}
                loading={loading}
                pageCount={pageCount}
                deleteRows={deleteRows}
                deleteSelected={deleteSelected}
                selectRow={selectRow}
                editRow={editRow}
            />
        </div>
    );
};

export default connect(
    ({ members }) => ({ members }),
    {
        getMembersRequest
    }
)(MembersOld);
