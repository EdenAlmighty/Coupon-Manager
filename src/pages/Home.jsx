import React, { useEffect, useState } from "react"
import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter"
import { couponService } from "../services/coupon.service"
import { CouponList } from "../components/CouponList"
import { CouponForm } from "../components/CouponForm"
import { CouponFilter } from "../components/CouponFilter"

export default function Home() {
	const [coupons, setCoupons] = useState([])
	const [couponToEdit, setCouponToEdit] = useState(null)
	const [filterBy, setFilterBy] = useState(couponService.getDefaultFilter())

	useEffect(() => {
		loadCoupons()
	}, [filterBy])

	async function loadCoupons() {
		try {
			const coupons = await couponService.query(filterBy)
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

	return (
		<>
			<AppHeader />
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
					filterBy={filterBy} />
			</main>
			<AppFooter />
		</>
	)
}
