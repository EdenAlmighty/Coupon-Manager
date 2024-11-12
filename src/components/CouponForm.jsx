import React, { useState, useEffect } from 'react'
import { couponService } from '../services/coupon.service'
import { CustomInput } from './CustomInput'

export function CouponForm({ coupon, onSave }) {
    const [formCoupon, setFormCoupon] = useState(couponService.getEmptyCoupon())
    const [error, setError] = useState('')

    useEffect(() => {
        if (coupon) {
            // Pre-fill the form when editing a coupon
            setFormCoupon(coupon)
        } else {
            // Default to percentage discount when creating new coupons
            setFormCoupon(prev => ({
                ...prev,
                discountType: 'percentage'
            }))
        }
    }, [coupon])

    function handleChange({ target }) {
        const { name, value, checked } = target

        if (name === 'isStackable') {
            setFormCoupon({
                ...formCoupon,
                [name]: checked,
            })
            return
        }

        if (name === 'expiryDate') {
            const timestamp = new Date(value).getTime()
            console.log('timestamp: ', timestamp)

            setFormCoupon({
                ...formCoupon,
                [name]: timestamp,
            })
            return
        }

        if (name === 'discountType' && value === 'flat') {
            setError('')
        }

        if (name === 'discountValue' && formCoupon.discountType === 'percentage') {
            if (value > 100) {
                setError('Discount cannot exceed 100%')
            } else {
                setError('')
            }
        }

        setFormCoupon({
            ...formCoupon,
            [name]: name === 'discountValue' && value === '' ? '' : value,
        })
    }


    async function handleSubmit(event) {
        event.preventDefault()
        if (error) return

        try {
            await couponService.save(formCoupon)
            onSave()
            setFormCoupon(couponService.getEmptyCoupon())
        } catch (err) {
            console.error("Failed to save coupon:", err)
        }
    }

    function handleReset() {
        setFormCoupon(couponService.getEmptyCoupon())
        setError('')
    }

    return (
        <div className="coupon-form-container">
            {/* Buttons outside the form */}
            <div className="form-actions">
                <button type="submit" onClick={handleSubmit}>Save Coupon</button>
                <button type="button" onClick={handleReset}>Undo</button>
            </div>

            {/* The Form itself */}
            <form onSubmit={handleSubmit} className="coupon-form">
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
                <div className="discount-input-container">
                    <CustomInput
                        label="Discount Value:"
                        type="number"
                        name="discountValue"
                        value={formCoupon.discountValue}
                        onChange={handleChange}
                    />
                    {error && <p className="error-message">{error}</p>}
                </div>
                <CustomInput
                    label="Discount Type:"
                    type="select"
                    name="discountType"
                    value={formCoupon.discountType}
                    onChange={handleChange}
                    options={[
                        { value: 'percentage', label: '%' },
                        { value: 'flat', label: '₪' }
                    ]}
                />
                <CustomInput
                    label="Is Stackable:"
                    type="checkbox"
                    name="isStackable"
                    checked={formCoupon.isStackable}
                    onChange={handleChange}
                />
                <CustomInput
                    label="Usage Limit:"
                    type="number"
                    name="usageLimit"
                    value={formCoupon.usageLimit}
                    onChange={handleChange}
                />
                <CustomInput
                    label="Expiry Date:"
                    type="date"
                    name="expiryDate"
                    value={formCoupon.expiryDate ? new Date(formCoupon.expiryDate).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                />
            </form>
        </div>
    )
}
