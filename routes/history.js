const express = require('express')
const historyRoute = express.Router()
const historyController = require('../controllers/historyController')
const authMiddleware = require('../middleware/auth')

historyRoute.get('/', historyController.index)
historyRoute.post('/', authMiddleware.checkUserToken, historyController.create)
module.exports = historyRoute