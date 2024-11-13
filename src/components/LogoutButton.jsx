import React from "react";

export default function LogoutButton({ onLogout, name }) {
    return (
        <div className="logout-container">
            <span>{name}</span>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}
