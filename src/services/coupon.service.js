import { storageService } from "./async-storage.service"
import { utilService } from "./util.service"

export const couponService = {
    query,
    getById,
    remove,
    save,
    getEmptyCoupon,
    getDefaultFilter,
    getDefaultSortBy,
}

const STORAGE_KEY = 'coupon'
const dataPath = import.meta.env.VITE_DATA_PATH || '/data'

async function query(filterBy = getDefaultFilter(), sortBy = getDefaultSortBy()) {
    try {
        let coupons = await storageService.query(STORAGE_KEY)
        if (!coupons || !coupons.length) {
            coupons = await _loadCoupons()
        }
        // Apply filters
        coupons = _applyFilters(coupons, filterBy)

        // Apply sorting
        coupons = _sortCoupons(coupons, sortBy)
        console.log('coupons: ', coupons)
        return coupons
    } catch (err) {
        console.error("Failed to fetch coupons:", err);
        throw err
    }
}

async function getById(entityId) {
    return storageService.get(STORAGE_KEY, entityId)
}

async function remove(entityId) {
    return storageService.remove(STORAGE_KEY, entityId)
}

async function save(coupon, user) {
    if (!user) throw new Error('User not logged in')

    if (coupon._id) {
        return storageService.put(STORAGE_KEY, coupon)
    } else {
        coupon.createdBy = {
            userID: user._id,
            username: user.username,
            fullname: user.fullname,
            time: Date.now(),
        }
        return storageService.post(STORAGE_KEY, coupon)
    }
}

function getEmptyCoupon() {
    return {
        code: "DEFAULT10",
        description: "",
        discountType: "",
        discountValue: "",
        expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
        isStackable: false,
        usageLimit: 1,
        usageCount: 0,
    }
}

function getDefaultFilter() {
    return {
        createdBy: '',
        txt: '',
        discountType: '',
        discountValue: '',
        isStackable: '',
        usageLimit: null,
        usageCount: null,
        expiryDate: ''
    }
}

function getDefaultSortBy() {
    return {
        by: '',
        asc: 1
    }
}

// Private functions
import { userService } from './user.service'

export async function _loadCoupons() {
    try {
        const response = await fetch(`${dataPath}/coupons.json`)
        if (!response.ok) {
            throw new Error('Failed to load coupons data')
        }

        const data = await response.json()
        const users = await userService.getUsers()

        const couponsWithIds = await storageService.post(STORAGE_KEY, data.map(coupon => {
            // If the coupon already has a createdBy object return that
            if (coupon.createdBy && typeof coupon.createdBy === 'object') {
                return coupon
            }

            // If the coupon doesn't have a createdBy object, find the user and add it
            const user = users.find(user => user.username === coupon.createdBy)
            return {
                ...coupon,
                createdBy: {
                    userID: user?._id || "unknown",
                    fullname: user?.fullname || "Unknown User",
                    time: coupon.createdAt || Date.now(),
                },
                expiryDate: coupon.expiryDate || (Date.now() + 30 * 24 * 60 * 60 * 1000),
            }
        }))

        return couponsWithIds
    } catch (error) {
        console.error('Error loading coupons:', error)
        throw error
    }
}

function _applyFilters(coupons, filterBy) {
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        coupons = coupons.filter(coupon =>
            regex.test(coupon.name) ||
            regex.test(coupon.code) ||
            regex.test(coupon.description)
        )
    }
    if (filterBy.createdBy) {
        coupons = coupons.filter(coupon => coupon.createdBy.userID === filterBy.createdBy || coupon.createdBy.username === filterBy.createdBy)
    }
    if (filterBy.discountType) {
        coupons = coupons.filter(coupon => coupon.discountType === filterBy.discountType)
    }
    if (filterBy.discountValue !== null && filterBy.discountValue !== '') {
        coupons = coupons.filter(coupon => coupon.discountValue === filterBy.discountValue)
    }
    if (filterBy.isStackable !== '') {
        coupons = coupons.filter(coupon => coupon.isStackable === filterBy.isStackable)
    }
    if (filterBy.usageLimit != null) {
        coupons = coupons.filter(coupon => coupon.usageLimit === filterBy.usageLimit)
    }
    if (filterBy.usageCount != null) {
        coupons = coupons.filter(coupon => coupon.usageCount === filterBy.usageCount)
    }
    if (filterBy.expiryDate) {
        const filterDate = Date.now()(filterBy.expiryDate)
        coupons = coupons.filter(coupon => Date.now()(coupon.expiryDate) <= filterDate)
    }
    return coupons
}

function _sortCoupons(coupons, sortBy) {
    if (!sortBy.by) return coupons

    return [...coupons].sort((a, b) => {
        let comparison = 0

        switch (sortBy.by) {
            case 'discountValue':
                const discountA = Number(a.discountValue)
                const discountB = Number(b.discountValue)
                comparison = discountA - discountB
                break
            case 'expiryDate':
                const dateA = a.expiryDate
                const dateB = b.expiryDate
                comparison = dateA - dateB
                break
            case 'isStackable':
                comparison = (a.isStackable === b.isStackable) ? 0 : (a.isStackable ? 1 : -1)
                break
            default:
                if (a[sortBy.by] < b[sortBy.by]) comparison = -1
                if (a[sortBy.by] > b[sortBy.by]) comparison = 1
                break
        }
        return sortBy.asc === 1 ? comparison : -comparison
    })
}
