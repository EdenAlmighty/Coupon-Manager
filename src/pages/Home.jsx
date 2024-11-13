import React, { useEffect, useState } from "react"
import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter"
import LoginModal from "../components/loginModal"
import CircularProgress from '@mui/material/CircularProgress';
import { couponService } from "../services/coupon.service"
import { CouponList } from "../components/CouponList"
import { CouponForm } from "../components/CouponForm"
import { CouponFilter } from "../components/CouponFilter"
import { useUser } from "../hooks/useUser"
import { useLoading } from "../hooks/useLoading"
import { Box } from "@mui/material"

export default function Home() {
	const [coupons, setCoupons] = useState([])
	const [couponToEdit, setCouponToEdit] = useState(null)
	const [filterBy, setFilterBy] = useState(couponService.getDefaultFilter())
	const [sortBy, setSortBy] = useState(couponService.getDefaultSortBy())
	// Login modal state
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const { loggedInUser, login, logout } = useUser()
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

	async function handleLogin(userCred) {
		try {
			const user = await login(userCred)
			if (user) {
				console.log("Login successful: ", user)
				handleClose()
				loadCoupons()
			} else {
				alert("Invalid credentials. Please try again.")
			}
		} catch (err) {
			console.error("Login error: ", err)
			alert("Login failed. Please try again.")
		}
	}

	async function handleLogout() {
		try {
			await logout()
		} catch (err) {
			console.error("Logout error: ", err)
			alert("Logout failed. Please try again.")
		}
	}


	return (
		<>
			<AppHeader
				onLogin={handleOpen}
				onLogout={handleLogout}
				loggedInUser={loggedInUser} />
			<LoginModal
				open={open}
				onClose={handleClose}
				onLogin={handleLogin} />
			<main>
				<CouponForm coupon={couponToEdit} onSave={handleSave} />
				<CouponFilter filterBy={filterBy} onFilter={handleFilter} />
				{isLoading ? (
					<Box display="flex" justifyContent="center" alignItems="center">
						<CircularProgress />
					</Box>) : (
					<>
						<CouponList
							coupons={coupons}
							onRemove={handleRemove}
							onEdit={handleEdit}
							filterBy={filterBy}
							onSort={handleSort}
							sortBy={sortBy}
						/>
					</>
				)}
			</main>
			<AppFooter />
		</>
	)
}
