import React, { useState, useEffect } from 'react'
import { couponService } from '../services/coupon.service'
import { CustomInput } from './CustomInput'

export function CouponForm({ coupon, onSave }) {
    const [formCoupon, setFormCoupon] = useState(couponService.getEmptyCoupon())

    useEffect(() => {
        if (coupon) {
            setFormCoupon(coupon)
        }
    }, [coupon])

    function handleChange({ target }) {
        const { name, value } = target
        setFormCoupon({ ...formCoupon, [name]: value })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            await couponService.save(formCoupon)
            onSave()
            setFormCoupon(couponService.getEmptyCoupon())
        } catch (err) {
            console.error("Failed to save coupon:", err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <CustomInput
                label="Code:"
                name="code"
                value={formCoupon.code}
                onChange={handleChange}
                required
            />
            <CustomInput
                label="Description:"
                name="description"
                value={formCoupon.description}
                onChange={handleChange}
            />
            <CustomInput
                label="Discount Type:"
                type="select"
                name="discountType"
                value={formCoupon.discountType}
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
                value={formCoupon.discountValue}
                onChange={handleChange}
            />
            <CustomInput
                label="Expiry Date:"
                type="date"
                name="expiryDate"
                value={formCoupon.expiryDate}
                onChange={handleChange}
            />
            <button type="submit">Save Coupon</button>
        </form>
    )
}
