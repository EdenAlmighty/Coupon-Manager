import React from 'react'

export function CouponPreview({ coupon }) {
    return (
        <>
            <td>{coupon.createdBy}</td>
            <td>{coupon.code}</td>
            <td>{coupon.description}</td>
            <td>{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `${coupon.discountValue}₪`}</td>
            <td>{coupon.isStackable ? "Yes" : "No"}</td>
            <td>{coupon.usageLimit}</td>
            <td>{coupon.usageCount}</td>
            <td>{coupon.expiryDate}</td>
        </>
    )
}
