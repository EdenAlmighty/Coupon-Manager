import { storageService } from "./async-storage.service"
import CryptoJS from 'crypto-js'
import { utilService } from "./util.service"

export const userService = {
    getById,
    login,
    logout,
    getLoggedinUser,
    signup
}

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export async function getUsers() {
    try {
        let users = await storageService.query('user')
        if (!users || !users.length) users = await _loadDefaultUsers()
        return users
    } catch (error) {
        console.error('Failed to get users:', error)
        throw error
    }
}

async function getById(userId) {
    try {
        const user = await storageService.get('user', userId)
        return user
    } catch (err) {
        console.error("Failed to fetch user:", err)
        throw err
    }
}

async function login(userCred) {
    try {
        const users = await getUsers()
        const user = users.find(u => u.username === userCred.username)
        console.log('user: ', user)
        if (!user) throw new Error('User not found')

        const hashedPassword = CryptoJS.SHA256(userCred.password).toString()
        if (hashedPassword !== user.password) throw new Error('Invalid credentials')

        return _saveLocalUser(user)
    } catch (err) {
        console.error("Failed to login:", err)
        throw err
    }
}

async function logout() {
    try {
        localStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    } catch (err) {
        console.error("Failed to logout:", err)
        throw err
    }
}

function getLoggedinUser() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
    } catch (error) {
        console.error('Failed to get logged in user:', error)
        return null
    }
}

async function signup(user) {
    try {
        user.password = CryptoJS.SHA256(user.password).toString()
        return await storageService.post('user', user)
    } catch (err) {
        console.error("Failed to signup:", err)
        throw err
    }
}

function _saveLocalUser(user) {
    user = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin
    }
    localStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

async function _loadDefaultUsers() {
    try {
        const response = await fetch(`${import.meta.env.VITE_DATA_PATH}/users.json`)
        if (!response.ok) {
            throw new Error('Failed to load users data')
        }
        const data = await response.json()
        // Hash users password before storing
        return data.map(user => ({
            ...user,
            _id: utilService.makeId(),
            password: CryptoJS.SHA256(user.password).toString()
        }))
    } catch (error) {
        console.error('Error loading users:', error)
        throw error
    }
}
