import React, { createContext, useState } from 'react'
import { userService } from '../services/user.service'

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [loggedInUser, setLoggedInUser] = useState(userService.getLoggedinUser())

    async function login(userCred) {
        try {
            const user = await userService.login(userCred)
            if (user) {
                setLoggedInUser(user)
                return user
            }
        } catch (err) {
            console.error("Login error:", err)
            throw err
        }
    }

    async function logout() {
        try {
            await userService.logout()
            setLoggedInUser(null)
        } catch (err) {
            console.error("Logout error:", err)
            throw err
        }
    }

    return (
        <UserContext.Provider value={{ loggedInUser, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}