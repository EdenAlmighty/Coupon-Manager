import React from 'react'
import { SwapVert, ArrowDownward, ArrowUpward } from '@mui/icons-material'

export function SortButton({ name, sortBy, onSort }) {
    function handleSort(ev) {
        ev.preventDefault()
        const newAscValue = sortBy.by === name && sortBy.asc === 1 ? -1 : 1
        const newSortBy = { by: name, asc: newAscValue }
        onSort(newSortBy)
    }

    return (
        <button className="icon-btn" name={name} onClick={handleSort}>
            {sortBy.by === name ? (
                sortBy.asc === 1 ? <ArrowUpward /> : <ArrowDownward />
            ) : (
                <SwapVert />
            )}
        </button>
    )
}