const express = require('express')
const commentRoute = express.Router()
const commentController = require('../controllers/commentController')
const authMiddleware = require('../middleware/auth')

commentRoute.post('/', authMiddleware.checkUserToken, commentController.create)
commentRoute.get('/', commentController.index)
commentRoute.get('/record-count', commentController.count)
module.exports = commentRoute