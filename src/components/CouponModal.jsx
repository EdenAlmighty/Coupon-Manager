import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { CustomInput } from './CustomInput'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
}

export default function CouponModal({ open, onClose, onSave, couponToEdit }) {
    const [coupon, setCoupon] = useState(couponToEdit)

    function handleChange({ target: { name, value, type, checked } }) {
        setCoupon(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        onSave(coupon)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="coupon-modal-title"
            aria-describedby="coupon-modal-description"
        >
            <Box sx={style}>
                <Typography id="coupon-modal-title" variant="h5" component="h2" sx={{ mb: 2 }}>
                    {couponToEdit ? 'Edit Coupon' : 'Create New Coupon'}
                </Typography>
                <form
                    onSubmit={handleSubmit}
                    className='coupon-form'
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}
                >
                    <CustomInput
                        label="Code"
                        type="text"
                        name="code"
                        value={coupon.code}
                        placeholder="Enter coupon code"
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Description"
                        type="text"
                        name="description"
                        value={coupon.description}
                        placeholder="Enter description"
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Discount Type"
                        type="text"
                        name="discountType"
                        value={coupon.discountType}
                        placeholder="Enter discount type (e.g. percentage, fixed)"
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Discount Value"
                        type="number"
                        name="discountValue"
                        value={coupon.discountValue}
                        placeholder="Enter discount value"
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Expiry Date"
                        type="date"
                        name="expiryDate"
                        value={coupon.expiryDate}
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Stackable"
                        type="checkbox"
                        name="isStackable"
                        checked={coupon.isStackable}
                        onChange={handleChange}
                    />
                    <CustomInput
                        label="Usage Limit"
                        type="number"
                        name="usageLimit"
                        value={coupon.usageLimit}
                        placeholder="Enter usage limit"
                        onChange={handleChange}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        {couponToEdit ? 'Save Changes' : 'Create Coupon'}
                    </Button>
                </form>
            </Box>
        </Modal>
    )
}
