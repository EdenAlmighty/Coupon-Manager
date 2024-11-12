import React from 'react';
import { CustomInput } from './CustomInput';

export function CouponFilter({ filterBy, onFilter }) {
    function handleChange(field, value) {
        if ((field === 'createdBy' || field === 'discountType') && value === 'all') {
            value = ''
        }
        const newFilterBy = { ...filterBy, [field]: value }
        console.log('newFilterBy: ', field, value);
        
        onFilter(newFilterBy)
    }

    return (
        <article className='coupon-filter'>
            <CustomInput
                label='Created By'
                type="select"
                name="createdBy"
                value={filterBy.createdBy}
                onChange={(ev) => handleChange('createdBy', ev.target.value)}
                options={[
                    { value: 'all', label: 'All' },
                    { value: 'adminUser123', label: 'adminUser123' },
                    { value: 'test', label: 'test' },
                    { value: 'admof', label: 'admof' }
                ]}
            />
            {/* Search all text options, createdBy, couponCode and description */}
            <CustomInput
                label="Search"
                type="text"
                id="txt"
                name="txt"
                value={filterBy.txt}
                onChange={(ev) => handleChange('txt', ev.target.value)}
            />

            <CustomInput
                label='Discount Type'
                type="select"
                name="discountType"
                value={filterBy.discountType}
                onChange={(ev) => handleChange('discountType', ev.target.value)}
                options={[
                    { value: 'all', label: 'All' },
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
