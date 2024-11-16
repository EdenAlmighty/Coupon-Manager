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
    getDefaultUser,
    remove,
}

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USERS = 'users'
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'secret'
const dataPath = import.meta.env.VITE_DATA_PATH || '/data'

let usersCache = null

export async function getUsers() {
    try {
        // If users are already cached
        if (usersCache) return usersCache

        // Check in localStorage
        const storedUsers = localStorage.getItem(STORAGE_KEY_USERS)
        if (storedUsers) {
            // Decrypt and parse stored data once
            const decryptedUsers = decryptData(storedUsers)
            if (decryptedUsers && Array.isArray(decryptedUsers)) {
                usersCache = decryptedUsers
                return usersCache
            }
        }

        // If not in localStorage, load users from the JSON file
        const response = await fetch(`${dataPath}/users.json`);
        if (!response.ok) {
            throw new Error('Failed to load users data')
        }
        const data = await response.json()
        usersCache = data.map(user => ({
            ...user,
            password: CryptoJS.SHA256(user.password).toString(),
        }))

        // Encrypt and save as a single encrypted JSON string
        localStorage.setItem(STORAGE_KEY_USERS, encryptData(usersCache))
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

        // Add the new user to usersCache
        if (!usersCache) usersCache = []
        usersCache.push(newUser)

        // Encrypt the entire usersCache array and save to storage
        localStorage.setItem(STORAGE_KEY_USERS, encryptData(usersCache))

        console.log(`User ${newUser.fullname} added successfully`)
        return newUser
    } catch (err) {
        console.error("Failed to add user:", err)
        throw err
    }
}

async function remove(userId) {
    try {
        usersCache = (await getUsers()).filter(user => user._id !== userId)
        localStorage.setItem(STORAGE_KEY_USERS, encryptData(usersCache))
    } catch (err) {
        console.error("Failed to remove user:", err)
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
    const sessionUser = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(sessionUser))
    return sessionUser
}

function encryptData(data) {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
    } catch (error) {
        console.error('Encryption failed:', error)
        return null
    }
}

function decryptData(data) {
    try {
        const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY)
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    } catch (error) {
        console.error('Decryption failed:', error)
        return null
    }
}
