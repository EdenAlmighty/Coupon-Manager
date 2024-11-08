import React, { useEffect, useState } from "react"
import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter"
import { couponService } from "../services/coupon.service"
import { CouponList } from "../components/CouponList"
import { CouponForm } from "../components/CouponForm"

export default function Home() {
	const [coupons, setCoupons] = useState([])
	const [couponToEdit, setCouponToEdit] = useState(null)

	useEffect(() => {
		loadCoupons()
	}, [])

	async function loadCoupons() {
		try {
			const coupons = await couponService.query()
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

	function handleSave(coupon) {
		setCouponToEdit(null)
		loadCoupons()
	}

	return (
		<>
			<AppHeader />
			<main>
				<CouponForm
					coupon={couponToEdit}
					onSave={handleSave} />
				<CouponList
					coupons={coupons}
					onRemove={handleRemove}
					onEdit={handleEdit} />
			</main>
			<AppFooter />
		</>
	)
}
