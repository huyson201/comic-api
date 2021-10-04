require('dotenv/config')
const { sequelize, User } = require('./models')
const express = require("express")
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const route = require('./routes')
const PORT = process.env.PORT || 4000



app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// router config
route(app)


server.listen(PORT, () => {
    // sequelize.sync()
    console.log('server is running on port ' + PORT)
})