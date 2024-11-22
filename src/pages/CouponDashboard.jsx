import React, { useEffect, useState } from "react"
import { couponService } from "../services/coupon.service"
import { CouponList } from "../components/CouponList"
import { CouponForm } from "../components/forms/CouponForm"
import { CouponFilter } from "../components/CouponFilter"
import { useLoading } from "../hooks/useLoading"
import CustomModal from "../components/modals/CustomModal"
import { userService } from "../services/user.service"
import { useUser } from "../hooks/useUser"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export default function CouponDashboard() {
    const [coupons, setCoupons] = useState([])
    const [couponToEdit, setCouponToEdit] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filterBy, setFilterBy] = useState(couponService.getDefaultFilter())
    const [sortBy, setSortBy] = useState(couponService.getDefaultSortBy())
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5) 
    const { isLoading, setIsLoading } = useLoading()
    const { loggedInUser } = useUser()

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
            showSuccessMsg(`Coupon removed successfully!`)
        } catch (err) {
            showErrorMsg('Failed to remove coupon')
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

    async function handleSave(coupon) {
        try{
            await couponService.save(coupon, loggedInUser)
            setCouponToEdit(null)
            setIsModalOpen(false)
            loadCoupons()
            showSuccessMsg(`Coupon ${coupon.code} saved successfully!`)
        } catch (err) {
            showErrorMsg('Failed to save coupon')
            console.error("Failed to save coupon:", err)
        }
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

    const totalPages = Math.ceil(coupons.length / itemsPerPage)
    const paginatedCoupons = coupons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    function handlePageChange(newPage) {
        setCurrentPage(newPage)
    }

    return (
        <>

            <CustomModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CouponForm coupon={couponToEdit} onSave={handleSave} />
            </CustomModal>

            <CouponFilter filterBy={filterBy} onFilter={handleFilter} users={users} />
            <CouponList
                coupons={paginatedCoupons}
                searchText={filterBy.txt} 
                onRemove={handleRemove}
                onEdit={handleEdit}
                filterBy={filterBy}
                onSort={handleSort}
                sortBy={sortBy}
                onCreate={handleCreate}
            />
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx}
                        onClick={() => handlePageChange(idx + 1)}
                        className={currentPage === idx + 1 ? "active" : ""}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </>
    )
}
