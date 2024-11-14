import React, { useEffect, useState } from "react"
import { userService } from "../services/user.service"
import { CustomInput } from "../components/CustomInput"
import { UserList } from "../components/UserList"

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState(userService.getDefaultUser())

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

    function handleChange({ target }) {
        const { name, value, checked, type } = target
        setNewUser(prevUser => ({
            ...prevUser,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    async function handleCreateUser(event) {
        event.preventDefault()
        try {
            await userService.signup(newUser)
            loadUsers()
            setNewUser(userService.getDefaultUser())
        } catch (err) {
            console.error("Failed to create user:", err)
        }
    }

    return (
        <div className="users-page">
            <h2>All Users</h2>
            <section className="create-user">
                <h2>Create New User</h2>
                <form onSubmit={handleCreateUser} className="create-user-form">
                    <CustomInput
                        label="Username"
                        type="text"
                        name="username"
                        placeholder="johndoe"
                        value={newUser.username}
                        onChange={handleChange} />
                    <CustomInput
                        label="Full Name"
                        type="text"
                        name="fullname"
                        placeholder="John Doe"
                        value={newUser.fullname}
                        onChange={handleChange} />
                    <CustomInput
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="********"
                        value={newUser.password}
                        onChange={handleChange} />
                    <CustomInput
                        label="Admin User?"
                        type="checkbox"
                        name="isAdmin"
                        checked={newUser.isAdmin}
                        onChange={handleChange} />
                    <button type="submit">Create User</button>
                </form>
                <UserList users={users} />
            </section>
        </div>
    )
}
