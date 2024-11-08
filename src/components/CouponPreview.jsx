import React from 'react'

export function CouponPreview({ coupon }) {
    return (
        <li key={coupon._id}>
            <h3>{coupon.code}</h3>
            <p>{coupon.description}</p>
            <p>Discount: {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `${coupon.discountValue}₪`}</p>
            <p>Expires: {coupon.expiryDate}</p>
        </li>)
}