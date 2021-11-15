require('dotenv/config')
const express = require("express")
const app = express()
const responseTime = require('response-time')
const server = require('http').createServer(app)
const cors = require('cors')
const route = require('./routes')
const PORT = process.env.PORT || 4000
const { socketIo, init } = require('./socket-io')




app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime())

route(app)
let io = init(server)
socketIo(io)

app.use(function (req, res, next) {
    req.io = io;
    next();
});

server.listen(PORT, async () => {
    console.log('server is running on port ' + PORT)
})

