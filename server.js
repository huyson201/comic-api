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
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
route(app)


server.listen(PORT, async () => {
    await sequelize.sync()
    console.log('server is running on port ' + PORT)
})

