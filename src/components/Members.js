import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { connect } from 'react-redux';
import { getMembersRequest } from '../actions/members';
import Filter from './Filter';
import Table from './Table';
import Pager from './Pager';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete'
// Let's simulate a large dataset on the server (outside of our component)
// const serverData = makeData(10000)

const Members = props => {

    const { getMembersRequest, members } = props;

    const columns = useMemo(
        () =>
            [
                {
                    header: 'Select',
                    accessor: 'select',
                },
                {
                    header: 'Id',
                    accessor: 'id',
                },
                {
                    header: 'Name',
                    accessor: 'name',
                },
                {
                    header: 'Email',
                    accessor: 'email',
                },
                {
                    header: 'Role',
                    accessor: 'role',
                },
                {
                    header: 'Action',
                    accessor: 'action',
                }
            ],
        []
    )

    // We'll start our table without any data
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [filter, setFilter] = useState('');
    const [serverData, setServerData] = useState([]);
    const [selectAll, setSelectAll] = useState(null);

    useEffect(() => {
        console.log('fetchin')
        const pc = Math.ceil(serverData.length / pageSize);
        console.log('pc 1', pc);
        setPageCount(pc);
        fetchData()
    }, [filter, pageIndex, pageSize, pageCount, serverData, selectAll])

    const nextPage = () => {
        setPageIndex(pageIndex + 1);
    }
    const gotoPage = pi => {
        setPageIndex(pi);
    }
    const previousPage = () => {
        setPageIndex(pageIndex - 1);
    }

    const editRow = id => {
        // show modal to edit the row.
        alert(`Modal with data to be edited with id ${id}`);
    }

    const deleteRow = id => {
        if (window.confirm('delete row?')) {
            const sd = serverData.filter(d => d.id !== id);
            console.log(sd.length)
            setServerData(sd)
        }
        setSelectAll(null)
    }

    const deleteSelected = () => {
        if (window.confirm('delete row?')) {
            setServerData(serverData.filter(d => !d.selected));
            setSelectAll(null);
        }
    }

    const selectRow = id => {
        // update the row with highlighting
        setServerData(serverData.map(d => {
            if (d.id === id) {
                d.selected = !d.selected;
            }
            return d;
        }));
        setSelectAll(null);
    }

    const fetchData = () => {
        setLoading(true);
        console.log(filter || 'none', '|', pageIndex, '|', pageCount, '|', pageSize, '|', pageCount);
        let tableData = serverData.filter(sd => {
            return filter === '' || (filter !== '' && (sd.name.indexOf(filter) >= 0 || sd.email.indexOf(filter) >= 0 || sd.role.indexOf(filter) >= 0 || sd.id.indexOf(filter) >= 0));
        })

        console.log('tableData.length', tableData.length);

        const pc = Math.ceil(tableData.length / pageSize);
        console.log('pc 2', pc);
        setPageCount(pc);

        // get the only page.
        tableData = tableData.filter((td, i) => {
            if (selectAll !== null) td.selected = selectAll;
            return i >= pageSize * pageIndex && i < (pageSize * pageIndex) + pageSize;
        });



        setData(tableData);
        setLoading(false);
    };


    const filterData = value => {
        setFilter(value.trim());
    };

    useEffect(() => {
        let tempMembers = members.items.map(m => { m['selected'] = false; return m; });
        console.log('initial server data')
        setServerData(tempMembers);
        const pc = Math.ceil(tempMembers.length / pageSize);
        setPageCount(pc);
    }, [members])

    useEffect(() => {
        getMembersRequest();
    }, [getMembersRequest]);

    const selectAllRows = (val) => {
        serverData.forEach((sd, i) => {
            if (i >= pageSize * pageIndex && i < (pageSize * pageIndex) + pageSize) {
                sd.selected = val
            }
        })
    }

    return (
        <div style={{ margin: 'auto', maxWidth: 1000, margin: 20 }}>
            <h2 style={{ marginTop: 0 }}>Members</h2>
            {loading && 'Loading...'}
            <Filter setFilter={filterData} placeholder={`Search ${members.items.length} records...`} />
            <Table
                columns={columns}
                selectAllRows={selectAllRows}
                data={data}
                loading={loading}
                pageCount={pageCount}
                pageIndex={pageIndex}
                deleteRow={deleteRow}
                deleteSelected={deleteSelected}
                selectRow={selectRow}
                editRow={editRow}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <Button color="secondary" variant="contained" startIcon={<Delete />} onClick={deleteSelected} >Delete Selected</Button>
                <Pager pageSize={pageSize} nextPage={nextPage} gotoPage={gotoPage} previousPage={previousPage} pageCount={pageCount} pageIndex={pageIndex} setPageSize={setPageSize} />
            </div>
        </div>
    );
};

export default connect(
    ({ members }) => ({ members }),
    {
        getMembersRequest
    }
)(Members);
