import React from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

export default function AppHeader({ onLogin, onLogout, loggedInUser }) {
    return (
        <header>
            <div className="logo-container">
                <img src="/logo.png" alt="logo" className="logo" />
                <h1>Coupon Manager</h1>
            </div>
            <div className="header-actions">
                {loggedInUser ? (
                    <LogoutButton onLogout={onLogout} name={loggedInUser.fullname} />
                ) : (
                    <LoginButton onLogin={onLogin} />
                )}
            </div>
        </header>
    );
}
