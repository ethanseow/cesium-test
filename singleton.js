let db = {}

const createNewObject = (id,obj) => {
    db = {...db,[id]:obj}
}

const getDbObject =  () => {
    return db
}

module.exports = {
    createNewObject,
    getDbObject
}