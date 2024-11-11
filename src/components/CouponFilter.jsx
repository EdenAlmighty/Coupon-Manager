import React from 'react';
import { CustomInput } from './CustomInput';

export function CouponFilter({ filterBy, onFilter }) {
    function handleChange(field, value) {
        if (field === 'createdBy' && value === 'all') {
            value = ''
        }
        const newFilterBy = { ...filterBy, [field]: value };
        onFilter(newFilterBy);
    }

    return (
        <article className='coupon-filter'>
            <label htmlFor="createdBy">Created By</label>
            <CustomInput
                type="select"
                name="createdBy"
                value={filterBy.createdBy}
                onChange={handleChange}
                options={[
                    { value: 'all', label: '---' },
                    { value: 'adminUser123', label: 'adminUser123' },
                    { value: 'test', label: 'test' },
                    { value: 'admof', label: 'admof' }
                ]}
            />
            {/* Search all text options, createdBy, couponCode and description */}
            <label htmlFor="txt">Search</label>
            <CustomInput
                type="text"
                id="txt"
                name="txt"
                value={filterBy.txt}
                onChange={(ev) => handleChange('txt', ev.target.value)}
            />

            <label htmlFor="discountType">Discount Type</label>
            <CustomInput
                type="select"
                name="discountType"
                value={filterBy.discountType}
                onChange={handleChange}
                options={[
                    { value: '', label: 'All' },
                    { value: 'percentage', label: '%' },
                    { value: 'flat', label: '₪' }
                ]}
            />

            <CustomInput
                label="Is Stackable:"
                type="checkbox"
                name="isStackable"
                checked={filterBy.isStackable}
                onChange={(ev) => handleChange('isStackable', ev.target.checked)}
            />

        </article>
    )
}
