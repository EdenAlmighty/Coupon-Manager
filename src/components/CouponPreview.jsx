import React from 'react'
import { Tooltip } from '@mui/material';
import { utilService } from '../services/util.service';

export function CouponPreview({ coupon, searchText }) {
    const descLimit = 50
    const isDescTooLong = coupon.description.length > descLimit
    const formattedDate = utilService.formatDate(coupon.expiryDate)

    // Function to get highlighted text
    function getHighlightedText(text, highlight) {
        if (!highlight) return text
    
        const regex = new RegExp(`(${highlight})`, 'gi')
        const parts = text.split(regex)
    
        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} className='highlight'>
                    {part}
                </span>
            ) : (
                part
            )
        )
    }
    
    return (
        <>
      <td>{getHighlightedText(coupon.createdBy.fullname, searchText)}</td>
      <td>{getHighlightedText(coupon.code, searchText)}</td>

            {/* Conditionally render tooltip for description */}
            {isDescTooLong ? (
                <Tooltip title={coupon.description} arrow>
                    <td className="description">
                        {coupon.description.length > 50 ? `${coupon.description.slice(0, 50)}...` : coupon.description}
                    </td>
                </Tooltip>
            ) : (
                <td className="description">
                    {coupon.description.length > 50 ? `${coupon.description.slice(0, 50)}...` : getHighlightedText(coupon.description, searchText)}
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