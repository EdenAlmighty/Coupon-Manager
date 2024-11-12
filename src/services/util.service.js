export const utilService = {
    saveToStorage,
    loadFromStorage,
    makeId,
    formatDate
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}


function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function formatDate(date) {
    const d = new Date(date)

    const month = d.getMonth() + 1
    const day = d.getDate()
    const year = d.getFullYear()

    // Expected "M/d/yyyy
    return `${month}/${day}/${year}`
}