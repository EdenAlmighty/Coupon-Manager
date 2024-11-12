import React from 'react'
import { Tooltip } from '@mui/material';
import { utilService } from '../services/util.service';

export function CouponPreview({ coupon }) {
    const descLimit = 50
    const isDescTooLong = coupon.description.length > descLimit
    const formattedDate = utilService.formatDate(coupon.expiryDate)

    return (
        <>
            <td>{coupon.createdBy}</td>
            <td>{coupon.code}</td>

            {/* Conditionally render tooltip for description */}
            {isDescTooLong ? (
                <Tooltip title={coupon.description} arrow>
                    <td className="description">
                        {coupon.description.length > 50 ? `${coupon.description.slice(0, 50)}...` : coupon.description}
                    </td>
                </Tooltip>
            ) : (
                <td className="description">
                    {coupon.description.length > 50 ? `${coupon.description.slice(0, 50)}...` : coupon.description}
                </td>
            )}

            <td>{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `${coupon.discountValue}₪`}</td>
            <td>{coupon.isStackable ? "Yes" : "No"}</td>
            <td>{coupon.usageLimit}</td>
            <td>{coupon.usageCount}</td>
            <td>{coupon.expiryDate ? formattedDate : "No Expiry"}</td>
        </>
    )
}