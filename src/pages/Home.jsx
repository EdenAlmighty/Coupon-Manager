import React, { useEffect, useState } from "react"
import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter"
import { couponService } from "../services/coupon.service"

export default function Home() {
  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    async function getCoupons() {
      try {
        const fetchedCoupons = await couponService.query()
        setCoupons(fetchedCoupons)
      } catch (err) {
        // Improved error handling
        console.error("Failed to fetch coupons:", err)
      }
    }
    
    getCoupons()
  }, [])

  return (
    <>
      <AppHeader />
      <main>
        <h1>Available Coupons</h1>
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <div key={coupon.id}>
              <h3>{coupon.code}</h3>
              <p>{coupon.description}</p>
              <p>Discount: {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `${coupon.discountValue}₪`}</p>
              <p>Expires: {coupon.expiryDate}</p>
            </div>
          ))
        ) : (
          <p>No coupons available at the moment.</p>
        )}
      </main>
      <AppFooter />
    </>
  )
}
