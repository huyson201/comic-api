const express = require('express')
const route = express.Router()
const controller = require('../controllers/notifyController')
route.patch('/:id', controller.update)

module.exports = route