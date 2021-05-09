import React from 'react';

const Pager = ({ pageSize, nextPage, gotoPage, previousPage, pageCount, pageIndex, setPageSize }) => {
    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount - 1;

    return (
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
                    {pageIndex + 1} of {pageCount}
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

    )
}
export default Pager;