import { storageService } from "./async-storage.service"
import { utilService } from "./util.service"
import defaultCoupons from "../../data/coupons.json"

export const couponService = {
    query,
    getById,
    remove,
    save,
    getEmptyCoupon,
    getDefaultFilter,
    getDefaultSortBy
}

const STORAGE_KEY = 'coupon'

async function query(filterBy = getDefaultFilter(), sortBy = getDefaultSortBy()) {
    let coupons = await storageService.query(STORAGE_KEY)
    console.log('coupons from service:', coupons)
    try {
        if (!coupons || !coupons.length) {
            const newCoupons = defaultCoupons.map(coupon => ({
                ...coupon,
                _id: utilService.makeId(),
            }))
            console.log(' new coupons from service:', newCoupons)

            await storageService.post(STORAGE_KEY, newCoupons)
            coupons = newCoupons
        }

        // Filter by all matching text types
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

        if (filterBy.discountValue !== null) {
            coupons = coupons.filter(coupon => coupon.discountValue === filterBy.discountValue)
        }

        if (filterBy.isStackable) {
            coupons = coupons.filter(coupon => coupon.isStackable === filterBy.isStackable)
        }

        if (filterBy.usageLimit) {
            coupons = coupons.filter(coupon => coupon.usageLimit === filterBy.usageLimit)
        }

        if (filterBy.usageCount) {
            coupons = coupons.filter(coupon => coupon.usageCount === filterBy.usageCount)
        }

        if (filterBy.expiryDate) {
            const filterDate = new Date(filterBy.expiryDate)
            coupons = coupons.filter(coupon => new Date(coupon.expiryDate) <= filterDate)
        }

        if (sortBy.by) {
            coupons = [...coupons].sort((a, b) => {
                if (a[sortBy.by] < b[sortBy.by]) return sortBy.asc === 1 ? -1 : 1
                if (a[sortBy.by] > b[sortBy.by]) return sortBy.asc === 1 ? 1 : -1
                return 0
            })
        }
        console.log('coupons returned from service:', coupons)

        return coupons
    } catch (err) {
        console.log(err)
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
        expiryDate: "",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
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
        discountValue: null,
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