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
        <section className="coupon-list-container">
            {coupons.length > 0 ? (
                coupons.map((coupon) => (
                    <ul className="coupon-list" key={coupon._id}>
                        <CouponPreview coupon={coupon} />
                        <button className="delete-btn" onClick={() => handleRemove(coupon._id)}>
                            X
                        </button>
                        <button className="edit-btn" onClick={() => onEdit(coupon)}>
                            Edit
                        </button>
                    </ul>
                ))
            ) : (
                <p>No coupons available at the moment.</p>
            )}
        </section>
    )
}
