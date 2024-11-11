import React from 'react'
import { CouponPreview } from './CouponPreview'
import { couponService } from '../services/coupon.service'

export function CouponList({ coupons, onRemove, onEdit }) {
    async function handleRemove(couponId) {
        try {
            await couponService.remove(couponId)
            onRemove(couponId)
        } catch (err) {
            console.error("Failed to remove coupon:", err)
        }
    }

    return (
        <table className="coupon-list-container">
            <thead>
                <tr>
                    <th className="createdBy">Created By</th>
                    <th className="code">Code</th>
                    <th className="description">Description</th>
                    <th className='discount'>Discount</th>
                    <th className='stackable'>Stackable</th>
                    <th className='limit'>Usage Limit</th>
                    <th className='count'>Usage Count</th>
                    <th className='expire'>Expires</th>
                    <th className='actions'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {coupons.length > 0 ? (
                    coupons.map(coupon => (
                        <tr key={coupon._id} className="coupon-preview">
                            <CouponPreview coupon={coupon} />
                            <td>
                                <button className="delete-btn" onClick={() => handleRemove(coupon._id)}>X</button>
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
    )
}
