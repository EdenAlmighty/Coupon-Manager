import { storageService } from "./async-storage.service"
import { utilService } from "./util.service"
import defaultCoupons from "../../data/coupons.json"

export const couponService = {
    query,
    getById,
    remove,
    save,
    getEmptyCoupon,
}

const STORAGE_KEY = 'coupon'


async function query() {
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
        // _id: utilService.makeId(),
        code: "DEFAULT10",
        description: "",
        discountType: "",
        discountValue: 0,
        expiryDate: "",
        createdBy: "",
        createdAt: new Date().toISOString(),
        isStackable: true,
        usageLimit: 0,
        usageCount: 0,
    }
}