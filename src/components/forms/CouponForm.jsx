import React, { useState, useEffect, useRef } from 'react'
import { couponService } from '../../services/coupon.service'
import CustomInput from '../CustomInput'
import { useLoading } from '../../hooks/useLoading'
import { Loader } from '../Loader'

export function CouponForm({ coupon, onSave }) {
    const [formCoupon, setFormCoupon] = useState(couponService.getEmptyCoupon())
    const [errors, setErrors] = useState({})
    const { isLoading, setIsLoading } = useLoading()
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current?.focus()

        if (coupon) {
            setFormCoupon(coupon)
        } else {
            setFormCoupon(prev => ({
                ...prev,
                discountType: 'percentage'
            }))
        }
    }, [coupon])

    function validateForm(formData) {
        let validationErrors = {}
        if (!formData.code) validationErrors.code = 'Code is required'
        if (!formData.description) validationErrors.description = 'Description is required'
        if (formData.discountValue === '' || formData.discountValue < 0) validationErrors.discountValue = 'Discount value must be a positive number'
        if (formData.discountType === 'percentage' && formData.discountValue > 100) validationErrors.discountValue = 'Percentage discount cannot exceed 100%'
        if (formData.usageLimit < 0) validationErrors.usageLimit = 'Usage limit cannot be negative'

        return validationErrors
    }

    function handleChange({ target }) {
        const { name, value, checked, type } = target
    
        setFormCoupon(prevFormCoupon => {
            let updatedValue
    
            if (name === 'discountValue' || name === 'usageLimit') {
                // Ensure numbers are stored as numbers
                updatedValue = Number(value) 
            } else if (type === 'checkbox') {
                updatedValue = checked
            } else if (name === 'expiryDate') {
                updatedValue = new Date(value).getTime()
            } else {
                updatedValue = value
            }
    
            const updatedCoupon = { ...prevFormCoupon, [name]: updatedValue }
    
            const validationErrors = validateForm(updatedCoupon)
            setErrors(validationErrors)
            return updatedCoupon
        })
    }
    

    async function handleSubmit(ev) {
        ev.preventDefault()

        const validationErrors = validateForm(formCoupon)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setIsLoading(true)

        try {
            onSave(formCoupon)
            setFormCoupon(couponService.getEmptyCoupon())
            setErrors({})

        } catch (err) {
            console.error("Failed to save coupon:", err)
        } finally {
            setIsLoading(false)
        }
    }

    function handleReset() {
        setFormCoupon(coupon ? coupon : couponService.getEmptyCoupon())
        setErrors({})
    }

    return (
        <div className="form-container">
            <h2>{coupon && coupon._id ? 'Edit Coupon' : 'Create Coupon'}</h2>
            <form onSubmit={handleSubmit} className="coupon-form">
                <CustomInput
                    label="Code:"
                    name="code"
                    value={formCoupon.code}
                    onChange={handleChange}
                    error={errors.code}
                    ref={inputRef}
                    required
                />
                <CustomInput
                    label="Description:"
                    name="description"
                    value={formCoupon.description}
                    onChange={handleChange}
                    placeholder="10% discount on any purchase"
                    error={errors.description}
                />
                <div className="joined-input-container">
                    <div className="discount-input-container">
                        <CustomInput
                            label="Discount Value:"
                            type="number"
                            name="discountValue"
                            value={formCoupon.discountValue}
                            onChange={handleChange}
                            error={errors.discountValue}
                        />
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
                        error={errors.discountType}
                    />
                    <CustomInput
                        label="Is Stackable:"
                        type="checkbox"
                        name="isStackable"
                        checked={formCoupon.isStackable}
                        onChange={handleChange}
                        error={errors.isStackable}
                    />
                </div>
                <div className="joined-input-container">
                    <CustomInput
                        label="Usage Limit:"
                        type="number"
                        name="usageLimit"
                        value={formCoupon.usageLimit}
                        onChange={handleChange}
                        error={errors.usageLimit}
                    />
                    <CustomInput
                        label="Expiry Date:"
                        type="date"
                        name="expiryDate"
                        value={formCoupon.expiryDate ? new Date(formCoupon.expiryDate).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                        error={errors.expiryDate}
                    />
                </div>
                <div className="form-actions">
                    <button className="primary" type="button" onClick={handleReset}>Clear</button>
                    <button className="primary" type="submit">{isLoading ? <Loader /> : 'Save Coupon'}</button>
                </div>
            </form>
        </div>
    )
}
