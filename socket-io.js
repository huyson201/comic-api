require('dotenv').config()
const jwt = require('jsonwebtoken')
const socketIO = require('socket.io')
const userConnectManager = require('./user-connect')

let io = null

const init = (server) => {
    io = socketIO(server, {
        cors: {
            origin: '*'
        }
    });

    return io
}

const getIo = () => {
    return io
}

const socketIo = (io) => {
    io.use((socket, next) => {

        const token = socket.handshake.auth.token;

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            userConnectManager.addUserConnected(decoded.user_uuid, socket.id)

            socket.on('disconnect', () => {
                console.log('user disconnected: ', socket.id)
                userConnectManager.deleteUserConnected(decoded.user_uuid, socket.id)
            })

            return next()

        } catch (error) {
            console.log(error.message)
            socket.disconnect()
        }


    })

    io.on('connect', socket => {
        console.log('user connected: ', socket.id)

    })



}

module.exports = { socketIo, init, getIo }