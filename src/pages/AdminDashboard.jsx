import React, { useEffect, useState } from "react"
import { userService } from "../services/user.service"
import { UserList } from "../components/UserList"
import UserForm from "../components/forms/UserForm"
import CustomModal from "../components/modals/CustomModal"

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [userToEdit, setUserToEdit] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        try {
            const users = await userService.getUsers()
            setUsers(users)
        } catch (err) {
            console.error("Failed to load users:", err)
        }
    }

    function handleCreate() {
        setUserToEdit(userService.getDefaultUser())
        setIsModalOpen(true)
    }

    async function handleSave(user) {
        try {
            if (user._id) await userService.update(user)
            else await userService.signup(user)

            loadUsers()
            setIsModalOpen(false)
            setUserToEdit(null)
        } catch (err) {
            console.error("Failed to save user:", err)
        }
    }

    async function handleRemove(userId) {
        try {
            await userService.remove(userId)
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
        } catch (err) {
            console.error("Failed to delete user:", err)
        }
    }

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <section className="user-management">
                <button onClick={handleCreate} className="primary">Create New User</button>

                <CustomModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <UserForm userToEdit={userToEdit} onSave={handleSave} />
                </CustomModal>

                <UserList users={users} onRemove={handleRemove} />
            </section>
        </div>
    )
}
