import React, { useEffect, useState } from "react"
import { userService } from "../services/user.service"
import { useUser } from "../hooks/useUser"
import { CustomInput } from "../components/CustomInput"
import { useLoading } from "../hooks/useLoading"
import { UserList } from "../components/UserList"

export default function AdminDashboard() {
    const { loggedInUser } = useUser()
    const {isLoading, setIsLoading} = useLoading()
    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState(userService.getDefaultUser())

    useEffect(() => {
        if (loggedInUser?.isAdmin) {
            loadUsers()
        }
    }, [loggedInUser])

    async function loadUsers() {
        setIsLoading(true)
        try {
            const users = await userService.getUsers()
            setUsers(users)
        } catch (err) {
            console.error("Failed to load users:", err)
            setMessage("Error: Could not load users.")
        } finally {
            setIsLoading(false)
        }
    }

    function handleChange({ target }) {
        const { name, value, checked, type } = target

        setNewUser(prevUser => ({
            ...prevUser,
            [name]: type === 'checkbox' ? checked : value
        }))
        return
    }

    async function handleCreateUser(event) {
        event.preventDefault()
        try {
            await userService.signup(newUser)
            console.log("newUser: ", newUser)

            loadUsers()
            setNewUser(userService.getDefaultUser())
        } catch (err) {
            console.error("Failed to create user:", err)
        }
    }

    if (!loggedInUser?.isAdmin) {
        return <div>You do not have permission to view this page.</div>
    }

    return (
        <div className="admin-dashboard">
            
            <h1>Admin Dashboard</h1>

            <UserList users={users} />

            <section className="create-user">
                <h2>Create New User</h2>
                <form onSubmit={handleCreateUser} className="create-user-form">
                    <CustomInput
                        label="Username"
                        type="text"
                        name="username"
                        value={newUser.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                    />
                    <CustomInput
                        label="Full Name"
                        type="text"
                        name="fullname"
                        value={newUser.fullname}
                        onChange={handleChange}
                        placeholder="Enter fullname"
                    />
                    <CustomInput
                        label="Password"
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                    />
                    <CustomInput
                        label="Admin User?"
                        type="checkbox"
                        name="isAdmin"
                        checked={newUser.isAdmin}
                        onChange={handleChange}
                    />
                    <button type="submit">Create User</button>
                </form>
            </section>
        </div>
    )
}
