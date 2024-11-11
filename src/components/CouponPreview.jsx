import React from 'react'

export function CouponPreview({ coupon }) {
    return (
        <li key={coupon._id} className='coupon-preview'>
            <p>{coupon.createdBy}</p>
            <p>{coupon.code}</p>
            <p>{coupon.description}</p>
            <p>Discount: {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `${coupon.discountValue}₪`}</p>
            <p>Expires: {coupon.expiryDate}</p>
            <p>Stackable: {coupon.isStackable ? "Yes" : "No"}</p>
            <p>Usage Limit: {coupon.usageLimit}</p>
            <p>Usage Count: {coupon.usageCount}</p>
            
        </li>)
}