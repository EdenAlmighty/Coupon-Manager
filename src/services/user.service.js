import { storageService } from "./async-storage.service"

export const userService = {
    getById,
    signup,
    login,
    logout,
}

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

window.userService = userService

async function getUsers() {
    try {
        const users = await storageService.query('user')
        console.log('users: ', users)
        if (!users || !users.length) {
            await _createDefaultUsers()
            return await storageService.query('user')
        }
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
    console.log('userCred: ', userCred)
    try {
        const users = await getUsers()
        const user = users.find(u => u.username === userCred.username && u.password === userCred.password)
        console.log('user: ', user)
        if (!user) {
            throw new Error('Invalid credentials')
        }
        return _saveLocalUser(user)
    } catch (err) {
        console.error("Failed to login:", err)
        throw err
    }
}

function _saveLocalUser(user) {
    user = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname, imgUrl:
            user.imgUrl, isAdmin:
            user.isAdmin
    }
    localStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

const defaultUsers = [
    {
        username: 'admin',
        fullname: 'Admin User',
        imgUrl: 'https://res.cloudinary.com/dkvliixzt/image/upload/v1704358773/person-empty_zckbtr_wrffbw.svg',
        isAdmin: true,
        password: '123'
    },
    {
        username: 'john',
        fullname: 'John Doe',
        imgUrl: 'https://res.cloudinary.com/dkvliixzt/image/upload/v1704358773/person-empty_zckbtr_wrffbw.svg',
        isAdmin: false,
        password: '123'
    },
    {
        username: 'jane',
        fullname: 'Jane Doe',
        imgUrl: 'https://res.cloudinary.com/dkvliixzt/image/upload/v1704358773/person-empty_zckbtr_wrffbw.svg',
        isAdmin: false,
        password: '123'
    },
]

async function _createDefaultUsers() {
    for (let user of defaultUsers) {
        try {
            await signup({
                username: user.username,
                fullname: user.fullname,
                imgUrl: user.imgUrl,
                isAdmin: user.isAdmin,
                password: user.password
            })
            console.log(`User ${user.fullname} created successfully`)
        } catch (error) {
            console.error(`Failed to create user ${user.fullname}:`, error)
        }
    }
}