import React from 'react'
import { UserPreview } from './UserPreview'

export function UserList({ users, onRemove, onCreate }) {
    return (
        <section className='user-list-container'>
            <button onClick={onCreate} className="primary">Create New User</button>
            <table className="user-list">
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
                                    <button className="delete-btn" onClick={() => onRemove(user._id)}>Delete</button>
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
        </section>
    )
}