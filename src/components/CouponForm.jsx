// CouponForm.js
import React, { useState } from 'react'
import { couponService } from '../services/coupon.service'
import { CustomInput } from './CustomInput'

export function CouponForm({ onSave }) {
    const [coupon, setCoupon] = useState(couponService.getEmptyCoupon())

    function handleChange({ target }) {
        const { name, value } = target
        setCoupon({ ...coupon, [name]: value })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            await couponService.save(coupon)
            onSave()
            setCoupon(couponService.getEmptyCoupon())
        } catch (err) {
            console.error("Failed to save coupon:", err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <CustomInput
                label="Code:"
                name="code"
                value={coupon.code}
                onChange={handleChange}
                required
            />
            <CustomInput
                label="Description:"
                name="description"
                value={coupon.description}
                onChange={handleChange}
            />
            <CustomInput
                label="Discount Type:"
                type="select"
                name="discountType"
                value={coupon.discountType}
                onChange={handleChange}
                options={[
                    { value: 'percentage', label: 'Percentage' },
                    { value: 'flat', label: 'Flat' }
                ]}
            />
            <CustomInput
                label="Discount Value:"
                type="number"
                name="discountValue"
                value={coupon.discountValue}
                onChange={handleChange}
            />
            <CustomInput
                label="Expiry Date:"
                type="date"
                name="expiryDate"
                value={coupon.expiryDate}
                onChange={handleChange}
            />
            <button type="submit">Save Coupon</button>
        </form>
    )
}
