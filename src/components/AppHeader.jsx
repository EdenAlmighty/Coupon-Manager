import React from "react"
import { NavLink } from "react-router-dom"

export default function AppHeader({ onLogin, onLogout, loggedInUser }) {
    return (
        <header>
            <div className="logo-container">
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="logo" className="logo" />
                <h1>Coupon Manager</h1>
            </div>
            {loggedInUser && (
                <>
                    <nav className="nav-links">
                        <NavLink
                            to="/coupons"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            COUPONS
                        </NavLink>
                        {loggedInUser.isAdmin && (
                            <>
                                <span className="separator">|</span>
                                <NavLink
                                    to="/users"
                                    className={({ isActive }) => (isActive ? "active" : "")}
                                >
                                    USERS
                                </NavLink>
                            </>
                        )}
                    </nav>
                    <div className="user-actions">
                        <button className="primary" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </>
            )}
        </header>
    )
}
