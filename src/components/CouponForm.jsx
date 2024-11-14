import React, { useState, useEffect } from 'react'
import { couponService } from '../services/coupon.service'
import { CustomInput } from './CustomInput'
import { useLoading } from '../hooks/useLoading'
import { Loader } from './Loader'

export function CouponForm({ coupon, onSave }) {
    const [formCoupon, setFormCoupon] = useState(couponService.getEmptyCoupon())
    const [error, setError] = useState('')
    const { isLoading, setIsLoading } = useLoading()

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

    let newFormCoupon = { ...formCoupon }

    if (name === 'isStackable') {
        newFormCoupon[name] = checked
    } else if (name === 'expiryDate') {
        newFormCoupon[name] = new Date(value).getTime()
    } else if (name === 'discountType') {
        newFormCoupon[name] = value
        setError('')
    } else if (name === 'discountValue' && formCoupon.discountType === 'percentage') {
        if (value > 100) {
            setError('Discount cannot exceed 100%')
        } else {
            setError('')
        }
        newFormCoupon[name] = value
    } else {
        newFormCoupon[name] = name === 'discountValue' && value === '' ? '' : value
    }

    setFormCoupon(newFormCoupon)
}

    async function handleSubmit(event) {
        event.preventDefault()
        if (error) return
    
        setIsLoading(true)
    
        try {
            await couponService.save(formCoupon)
            onSave()
            setFormCoupon(couponService.getEmptyCoupon())
        } catch (err) {
            console.error("Failed to save coupon:", err)
        } finally {
            setIsLoading(false)
        }
    }
    

    function handleReset() {
        if (coupon) {
            setFormCoupon(coupon)
        } else {
            setFormCoupon(couponService.getEmptyCoupon())
        }
        setError('')
    }
    

    return (
        <div className="coupon-form-container">

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
                <div className="joined-input-container">
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
                            { value: '', label: '---' },
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
                </div>
                <div className="joined-input-container">
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
                </div>
                {/* Buttons outside the form */}
                <div className="form-actions">
                    <button className="primary" type="button" onClick={handleReset}>Undo</button>
                    <button className="primary" type="submit">{isLoading ? <Loader /> : 'Save Coupon'}</button>
                </div>
            </form>
        </div>
    )
}
