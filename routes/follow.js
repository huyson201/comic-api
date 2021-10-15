const express = require('express')
const followRoute = express.Router()
const followController = require('../controllers/followController')
const authMiddleware = require('../middleware/auth')

followRoute.get('/', followController.index)
followRoute.post('/', authMiddleware.checkUserToken, followController.create)
followRoute.delete('/', authMiddleware.checkUserToken, followController.delete)
module.exports = followRoute