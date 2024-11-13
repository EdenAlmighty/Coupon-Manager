import React from 'react'
import { UserPreview } from './UserPreview'

export function UserList({ users }) {
    return (
        <table className="user-list-container">
            <thead>
                <tr>
                    <th className="fullname">Full Name</th>
                    <th className="username">Username</th>
                    <th className="admin-status">Admin Status</th>
                    <th className="actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0 ? (
                    users.map((user, idx) => (
                        <tr key={user._id + idx} className="user-preview">
                            <UserPreview user={user} />
                            <td>
                                <button className="delete-btn">Delete</button>
                                <button className="edit-btn">Edit</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No users available at the moment.</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}