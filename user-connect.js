
const users = {}

const addUserConnected = (userId, socketId) => {
    if (!users[userId]) {
        users[userId] = [socketId]
    }

    if (!users[userId].includes(socketId)) {
        users[userId].push(socketId)
    }

    console.log(users)
}

const getUserConnected = (userId) => {
    return users[userId]
}

const deleteUserConnected = (userId, socketId) => {
    let index = users[userId].indexOf(socketId)
    if (index !== -1) {
        users[userId].splice(index, 1)
    }

    console.log(users)
}

const userConnectManager = {
    addUserConnected,
    getUserConnected,
    deleteUserConnected
}

module.exports = userConnectManager