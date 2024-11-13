import React, { useEffect, useState } from "react"
import { couponService } from "../services/coupon.service"
import { CouponList } from "../components/CouponList"
import { CouponForm } from "../components/CouponForm"
import { CouponFilter } from "../components/CouponFilter"
import { useLoading } from "../hooks/useLoading"

export default function CouponDashboard() {
    const [coupons, setCoupons] = useState([])
    const [couponToEdit, setCouponToEdit] = useState(null)
    const [filterBy, setFilterBy] = useState(couponService.getDefaultFilter())
    const [sortBy, setSortBy] = useState(couponService.getDefaultSortBy())
    const { isLoading, setIsLoading } = useLoading()

    useEffect(() => {
        loadCoupons()
    }, [filterBy, sortBy])

    async function loadCoupons() {
        setIsLoading(true)
        try {
            const coupons = await couponService.query(filterBy, sortBy)
            setCoupons(coupons)
        } catch (err) {
            console.error("Failed to fetch coupons:", err)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleRemove(couponId) {
		// Optimistic update
		setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon._id !== couponId))

		try {
			const updatedCoupons = await couponService.remove(couponId)
			setCoupons(updatedCoupons)
		} catch (err) {
			console.error("Failed to remove coupon:", err)
		}
	}

    function handleEdit(coupon) {
        setCouponToEdit(coupon)
    }

    function handleSave() {
        setCouponToEdit(null)
        loadCoupons()
    }

    function handleFilter(filterBy) {
        setFilterBy(filterBy)
    }

    function handleSort(sortBy) {
        setSortBy(sortBy)
    }

    return (
        <>
            <CouponForm coupon={couponToEdit} onSave={handleSave} />
            <CouponFilter filterBy={filterBy} onFilter={handleFilter} />
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <CouponList
                    coupons={coupons}
                    onRemove={handleRemove}
                    onEdit={handleEdit}
                    filterBy={filterBy}
                    onSort={handleSort}
                    sortBy={sortBy}
                />
            )}
        </>
    )
}
