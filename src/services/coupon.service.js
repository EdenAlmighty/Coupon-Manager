import { storageService } from "./async-storage.service"
import { utilService } from "./util.service"

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
    if (!coupons || !coupons.length) {
        await storageService.post(STORAGE_KEY, defaultCoupons)
        coupons = defaultCoupons
    }
    return coupons
}

async function getById(entityType, entityId) {
    return storageService.get(entityType, entityId)
}

async function remove(entityType, entityId) {
    return storageService.remove(entityType, entityId)
}

async function save(entityType, coupon) {
    if (coupon.id) {
        return storageService.put(entityType, coupon)
    } else {
        return storageService.post(entityType, coupon)
    }
}

function getEmptyCoupon() {
    return {
        id: utilService.makeId(),
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



const defaultCoupons = [
    {
        id: utilService.makeId(),
        code: "SUMMER10",
        description: "10% off on orders above 90₪",
        discountType: "percentage",
        discountValue: 10,
        expiryDate: "2024-12-31",
        createdBy: "adminUser123",
        createdAt: new Date().toISOString(),
        isStackable: true,
        usageLimit: 100,
        usageCount: 0,
    },
    {
        id: utilService.makeId(),
        code: "WINTER15",
        description: "15% off on orders above 150₪",
        discountType: "percentage",
        discountValue: 15,
        expiryDate: "2024-12-31",
        createdBy: "adminUser123",
        createdAt: new Date().toISOString(),
        isStackable: false,
        usageLimit: 50,
        usageCount: 0,
    },
    {
        id: utilService.makeId(),
        code: "FREESHIP",
        description: "Free shipping on orders over 200₪",
        discountType: "flat",
        discountValue: 0,
        expiryDate: "2024-11-30",
        createdBy: "adminUser123",
        createdAt: new Date().toISOString(),
        isStackable: true,
        usageLimit: 200,
        usageCount: 0,
    },
    {
        id: utilService.makeId(),
        code: "HOLIDAY20",
        description: "20% off sitewide for the holiday season",
        discountType: "percentage",
        discountValue: 20,
        expiryDate: "2024-12-31",
        createdBy: "adminUser123",
        createdAt: new Date().toISOString(),
        isStackable: false,
        usageLimit: 50,
        usageCount: 0,
    }
]