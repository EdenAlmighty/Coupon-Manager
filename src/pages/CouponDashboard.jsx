import React, { useEffect, useState } from "react"
import { couponService } from "../services/coupon.service"
import { CouponList } from "../components/CouponList"
import { CouponForm } from "../components/forms/CouponForm"
import { CouponFilter } from "../components/CouponFilter"
import { useLoading } from "../hooks/useLoading"
import CustomModal from "../components/modals/CustomModal"
import { userService } from "../services/user.service"

export default function CouponDashboard() {
    const [coupons, setCoupons] = useState([])
    const [couponToEdit, setCouponToEdit] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filterBy, setFilterBy] = useState(couponService.getDefaultFilter())
    const [sortBy, setSortBy] = useState(couponService.getDefaultSortBy())
    const [users, setUsers] = useState([])
    const { isLoading, setIsLoading } = useLoading()

    useEffect(() => {
        handleGetUsers()
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

    function handleCreate() {
        setCouponToEdit(couponService.getEmptyCoupon())
        setIsModalOpen(true)
    }

    function handleEdit(coupon) {
        setCouponToEdit(coupon)
        setIsModalOpen(true)
    }

    function handleSave() {
        setCouponToEdit(null)
        setIsModalOpen(false)
        loadCoupons()
    }

    function handleFilter(filterBy) {
        setFilterBy(filterBy)
    }

    function handleSort(sortBy) {
        setSortBy(sortBy)
    }

    async function handleGetUsers() {
        try {
            const users = await userService.getUsers()
            setUsers(users)
        } catch (err) {
            console.error("Failed to fetch users:", err)
        }
    }

    return (
        <>

            <CustomModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CouponForm coupon={couponToEdit} onSave={handleSave} />
            </CustomModal>

            <CouponFilter filterBy={filterBy} onFilter={handleFilter} users={users} />
            <CouponList
                coupons={coupons}
                onRemove={handleRemove}
                onEdit={handleEdit}
                filterBy={filterBy}
                onSort={handleSort}
                sortBy={sortBy}
                onCreate={handleCreate}
            />
        </>
    )
}
