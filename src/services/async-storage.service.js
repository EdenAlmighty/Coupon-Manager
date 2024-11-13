export const storageService = {
    query,
    get,
    post,
    put,
    remove,
}

async function query(entityType, delay = 300) {
    const entities = JSON.parse(localStorage.getItem(entityType)) || []
    return new Promise(resolve => setTimeout(() => resolve(entities), delay))
}

async function get(entityType, entityId) {
    const entities = await query(entityType)
    const entity = entities.find(entity => entity._id === entityId)

    if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
    return entity
}

async function post(entityType, newEntities) {
    if (!Array.isArray(newEntities)) newEntities = [newEntities]
    newEntities = newEntities.map(entity => ({ ...entity, _id: _makeId() }))

    const entities = await query(entityType)
    const updatedEntities = [...entities, ...newEntities]

    _save(entityType, updatedEntities)
    return newEntities
}

async function put(entityType, updatedEntity) {
    const entities = await query(entityType)
    const idx = entities.findIndex(entity => entity._id === updatedEntity._id)

    if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity._id} in: ${entityType}`)
    entities.splice(idx, 1, updatedEntity)
    _save(entityType, entities)
    return updatedEntity
}

async function remove(entityType, entityId) {
    const entities = await query(entityType)
    const idx = entities.findIndex(entity => entity._id === entityId)
    
    if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
    entities.splice(idx, 1)
    _save(entityType, entities)
    return entities
}

function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}
