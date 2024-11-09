import React from "react"

export default function AppHeader() {
    return (
        <header>
            <div className="logo-container">
                <img src="/logo.png" alt="logo" className="logo" />
                <h1>Coupon Manager</h1>
            </div>
        </header>
    )
}