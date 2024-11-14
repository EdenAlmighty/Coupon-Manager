import { storageService } from "./async-storage.service"
import CryptoJS from 'crypto-js'
import { utilService } from "./util.service"

export const userService = {
    getUsers,
    getById,
    login,
    logout,
    getLoggedinUser,
    signup,
    getDefaultUser
}

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USERS = 'users'

let usersCache = null

export async function getUsers() {
    try {
        // If users are already cached
        if (usersCache) return usersCache

        // If not, check in localStorage
        const storedUsers = localStorage.getItem(STORAGE_KEY_USERS)
        if (storedUsers) {
            usersCache = decryptData(storedUsers)
            // usersCache = JSON.parse(storedUsers)
            return usersCache
        }

        // If not in localStorage, load users from the JSON
        const response = await fetch(`${import.meta.env.VITE_DATA_PATH}/users.json`)
        if (!response.ok) {
            throw new Error('Failed to load users data')
        }
        const data = await response.json()
        usersCache = data.map(user => ({
            ...user,
            password: CryptoJS.SHA256(user.password).toString(),
            _id: utilService.makeId()
        }))

        // Encrypt and save to local storage
        localStorage.setItem(STORAGE_KEY_USERS, encryptData(usersCache))
        // localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersCache))
        return usersCache
    } catch (error) {
        console.error('Failed to get users:', error)
        throw error
    }
}

async function getById(userId) {
    try {
        const users = await getUsers()
        const user = users.find(u => u._id === userId)
        if (!user) throw new Error('User not found')
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
        if (!user) throw new Error('User not found')

        const hashedPassword = CryptoJS.SHA256(userCred.password).toString()
        if (hashedPassword !== user.password) throw new Error('Invalid credentials')

        return _saveSessionUser(user)
    } catch (err) {
        console.error("Failed to login:", err)
        throw err
    }
}

async function logout() {
    try {
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    } catch (err) {
        console.error("Failed to logout:", err)
        throw err
    }
}

function getLoggedinUser() {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
    } catch (error) {
        console.error('Failed to get logged in user:', error)
        return null
    }
}

async function signup(newUser) {
    try {
        // Hash password before adding user
        newUser.password = CryptoJS.SHA256(newUser.password).toString()
        newUser._id = utilService.makeId()

        // Add the new user to the localStorage users list
        if (!usersCache) usersCache = []
        usersCache.push(newUser)

        // Encrypt and save to local storage
        localStorage.setItem(STORAGE_KEY_USERS, encryptData(usersCache))
        // localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersCache))

        console.log(`User ${newUser.fullname} added successfully`)
        return newUser
    } catch (err) {
        console.error("Failed to add user:", err)
        throw err
    }
}

function getDefaultUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        isAdmin: false,
    }
}

function _saveSessionUser(user) {
    user = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'your-secret-key').toString();
}

function decryptData(data) {
    try {
        const bytes = CryptoJS.AES.decrypt(data, 'your-secret-key');
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}