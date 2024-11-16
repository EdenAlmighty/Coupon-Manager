import React, { useState } from 'react'
import { UserPreview } from './UserPreview'
import { Pagination } from './Pagination'

export function UserList({ users, onRemove, onCreate }) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const totalPages = Math.ceil(users.length / itemsPerPage)
    const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    function handlePageChange(newPage) {
        setCurrentPage(newPage)
    }
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
                    {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user, idx) => (
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
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </section>
    )
}