import React, { useEffect, useState } from "react"
import { couponService } from "../services/coupon.service"
import { CouponList } from "../components/CouponList"
import CouponModal from "../components/CouponModal"
import { CouponFilter } from "../components/CouponFilter"
import { useLoading } from "../hooks/useLoading"

export default function CouponDashboard() {
    const [coupons, setCoupons] = useState([])
    const [couponToEdit, setCouponToEdit] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
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
        setIsModalOpen(true)
    }

    function handleCreate() {
        setCouponToEdit(couponService.getEmptyCoupon())
        setIsModalOpen(true)
    }

    function handleSave() {
        setIsModalOpen(false)
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
            <button onClick={handleCreate}>Create New Coupon</button>
            <CouponModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                couponToEdit={couponToEdit || couponService.getEmptyCoupon()}
            />
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
