import React from "react"

export default function AppHeader({ onLogin }) {
    return (
        <header>
            <div className="logo-container">
                <img src="/logo.png" alt="logo" className="logo" />
                <h1>Coupon Manager</h1>
            </div>
            <div className="header-actions">
                <button onClick={onLogin}>Login</button>
            </div>
        </header>
    )
}