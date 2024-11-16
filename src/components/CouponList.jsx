import React from 'react'
import { CouponPreview } from './CouponPreview'
import { SortButton } from './SortButton'

export function CouponList({ coupons, onRemove, onEdit, onSort, sortBy, onCreate }) {

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
                {coupons.length > 0 ? (
                    coupons.map((coupon, idx) => (
                        <tr key={coupon._id + idx} className="coupon-preview">
                            <CouponPreview coupon={coupon} />
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
        </section>
    )
}
