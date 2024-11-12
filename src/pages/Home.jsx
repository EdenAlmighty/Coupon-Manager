import React, { useEffect, useState } from "react"
import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter"
import { couponService } from "../services/coupon.service"
import { CouponList } from "../components/CouponList"
import { CouponForm } from "../components/CouponForm"
import { CouponFilter } from "../components/CouponFilter"
import LoginModal from "../components/loginModal"
import { userService } from "../services/user.service"

export default function Home() {
	const [coupons, setCoupons] = useState([])
	const [couponToEdit, setCouponToEdit] = useState(null)
	const [filterBy, setFilterBy] = useState(couponService.getDefaultFilter())
	const [sortBy, setSortBy] = useState(couponService.getDefaultSortBy())
	// Login modal state
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	useEffect(() => {
		loadCoupons()
	}, [filterBy, sortBy])

	async function loadCoupons() {
		try {
			const coupons = await couponService.query(filterBy, sortBy)
			setCoupons(coupons)
		} catch (err) {
			console.error("Failed to fetch coupons:", err)
		}
	}

	function handleRemove(couponId) {
		setCoupons((prevCoupons) => prevCoupons.filter((coupon) => coupon._id !== couponId))
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

	function handleLogin(userCred) {
		userService.login(userCred)
			.then(user => {
				if (user) {
					console.log("Login successful: ", user);
					handleClose();
					loadCoupons();
				} else {
					alert("Invalid credentials. Please try again.");
				}
			})
			.catch(err => {
				console.error("Login error: ", err);
				alert("Login failed. Please try again.");
			});
	}
	  

	return (
		<>
			<AppHeader
				onLogin={handleOpen} />
			<LoginModal
				open={open}
				onClose={handleClose}
				onLogin={handleLogin} />
			<main>
				<CouponForm
					coupon={couponToEdit}
					onSave={handleSave} />
				<CouponFilter
					filterBy={filterBy}
					onFilter={handleFilter} />
				<CouponList
					coupons={coupons}
					onRemove={handleRemove}
					onEdit={handleEdit}
					filterBy={filterBy}
					onSort={handleSort}
					sortBy={sortBy} />
			</main>
			<AppFooter />
		</>
	)
}
