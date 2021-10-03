require('dotenv/config')
const { sequelize, User } = require('./models')
const express = require("express")
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')

const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    // let user = await User.create({ user_name: "huyson", user_email: "huyson1@gmail.com", user_password: "dasdsad" }).catch(err => console.log(err))
    // res.json(user)
})


server.listen(PORT, () => {
    sequelize.sync()
    console.log('server is running on port ' + PORT)
})