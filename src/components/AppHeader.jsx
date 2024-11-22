import React from "react"
import { NavLink } from "react-router-dom"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export default function AppHeader({ onLogin, onLogout, loggedInUser }) {

    async function handleLogout() {
        try{
            onLogout()
            showSuccessMsg('Logged out successfully!')
        } catch (err) {
            showErrorMsg('Failed to logout')
            console.error("Logout error:", err)
        }

    }

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
                        <button className="primary" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </>
            )}
        </header>
    )
}
