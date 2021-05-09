import React from 'react';

import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


const Table = ({ columns, data, pageIndex, loading, pageCount, deleteRow, editRow, selectRow }) => {
    // Render the UI for your table
    return (
        <>
            <MaUTable>
                <TableHead>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell key={column.accessor}>
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, i) => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Checkbox checked={row.checked} onChange={() => selectRow(row.id)} />
                                </TableCell>
                                <TableCell>
                                    {row.id}
                                </TableCell>
                                <TableCell>
                                    {row.name}
                                </TableCell>
                                <TableCell>
                                    {row.email}
                                </TableCell>
                                <TableCell>
                                    {row.role}
                                </TableCell>
                                <TableCell>
                                    <>
                                        <EditIcon style={{ cursor: 'pointer' }} onClick={() => editRow(row.id)} />
                                        <DeleteIcon color="error" style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => deleteRow(row.id)} />
                                    </>
                                </TableCell>

                            </TableRow>
                        )
                    })}
                    <TableRow>
                        {loading ? (
                            // Use our custom loading state to show a loading indicator
                            <TableCell colSpan="10000">Loading...</TableCell>
                        ) : (
                            <TableCell colSpan="10000">
                                Showing {(pageIndex + 1)} of ~{pageCount} results
                            </TableCell>
                        )}
                    </TableRow>
                </TableBody>
            </MaUTable>
        </>
    )
}

export default Table;