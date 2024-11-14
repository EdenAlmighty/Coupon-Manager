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
        handleError(err)
        throw err
    }
}

async function getById(entityId) {
    return storageService.get(STORAGE_KEY, entityId)
}

async function remove(entityId) {
    return storageService.remove(STORAGE_KEY, entityId)
}

async function save(coupon) {
    if (coupon._id) {
        return storageService.put(STORAGE_KEY, coupon)
    } else {
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
        createdBy: "admin",
        createdAt: Date.now(),
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
export async function _loadCoupons() {
    try {
        const response = await fetch(`${import.meta.env.VITE_DATA_PATH}/coupons.json`);
        if (!response.ok) {
            throw new Error('Failed to load coupons data')
        }
        const data = await response.json()
        const couponsWithIds = await storageService.post(STORAGE_KEY, data.map(coupon => ({
            ...coupon,
            createdAt: Date.now(),
            expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
        })))
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
        coupons = coupons.filter(coupon => coupon.createdBy === filterBy.createdBy)
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
