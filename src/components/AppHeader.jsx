import React from "react"
import { Link } from "react-router-dom"

export default function AppHeader({ onLogin, onLogout, loggedInUser }) {
    return (
        <header>
            <div className="logo-container">
                <img src="/logo.png" alt="logo" className="logo" />
                <h1>Coupon Manager</h1>
            </div>
            <div className="header-actions">
                {loggedInUser &&
                    <nav>
                        <>
                            <Link to="/coupons">Coupons</Link>
                            {loggedInUser.isAdmin && <Link to="/users">Users</Link>}
                        </>
                        <button className="primary" onClick={onLogout}>Logout</button>
                    </nav>
                }
            </div>
        </header>
    )
}
