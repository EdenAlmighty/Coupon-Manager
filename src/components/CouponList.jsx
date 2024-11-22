import React, { useState } from 'react'
import { CouponPreview } from './CouponPreview'
import { SortButton } from './SortButton'
import { Pagination } from './Pagination'

export function CouponList({ coupons, onRemove, onEdit, onSort, sortBy, onCreate, searchText }) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const totalPages = Math.ceil(coupons.length / itemsPerPage)
    const paginatedCoupons = coupons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    function handlePageChange(newPage) {
        setCurrentPage(newPage)
    }

    return (
        <section className='coupon-list-container'>
            <button className="create-coupon-btn primary" onClick={onCreate}>Create New Coupon</button>

            <table className="coupon-list">
                <thead>
                    <tr>
                        <th className="createdBy">
                            Created By
                            <SortButton name="createdBy" sortBy={sortBy} onSort={onSort} />
                        </th>
                        <th className="code">
                            Code
                            <SortButton name="code" sortBy={sortBy} onSort={onSort} />
                        </th>
                        <th className="description">
                            Description
                            <SortButton name="description" sortBy={sortBy} onSort={onSort} />
                        </th>
                        <th className="discount">
                            Discount
                            <SortButton name="discountType" sortBy={sortBy} onSort={onSort} />
                        </th>
                        <th className="stackable">
                            Stackable
                            <SortButton name="isStackable" sortBy={sortBy} onSort={onSort} />
                        </th>
                        <th className="limit">
                            Usage Limit
                            <SortButton name="usageLimit" sortBy={sortBy} onSort={onSort} />
                        </th>
                        <th className="count">
                            Usage Count
                            <SortButton name="usageCount" sortBy={sortBy} onSort={onSort} />
                        </th>
                        <th className="expire">
                            Expires
                            <SortButton name="expiryDate" sortBy={sortBy} onSort={onSort} />
                        </th>
                        <th className="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCoupons.length > 0 ? (
                        paginatedCoupons.map((coupon, idx) => (
                            <tr key={coupon._id + idx} className="coupon-preview">
                                <CouponPreview coupon={coupon} searchText={searchText} />
                                <td>
                                    <button className="delete-btn" onClick={() => onRemove(coupon._id)}>X</button>
                                    <button className="edit-btn" onClick={() => onEdit(coupon)}>Edit</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No coupons available at the moment.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </section>
    )
}
