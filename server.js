require('dotenv/config')
const express = require("express")
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const route = require('./routes')
const PORT = process.env.PORT || 4000
const socketIo = require('./socket-io')

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('io', io)

route(app)
socketIo(io)


server.listen(PORT, async () => {
    console.log('server is running on port ' + PORT)
})

