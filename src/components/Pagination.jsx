import React from 'react'

export function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    return (
        <div className="pagination">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
                <button
                    key={idx}
                    onClick={() => onPageChange(idx + 1)}
                    className={currentPage === idx + 1 ? 'active' : ''}
                >
                    {idx + 1}
                </button>
            ))}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    )
}
