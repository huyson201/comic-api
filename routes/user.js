const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth')

userRoute.get('/', userController.index)
userRoute.get('/:uuid', userController.getById)

userRoute.post('/', userController.create)

userRoute.patch('/:uuid', authMiddleware.checkUserToken, userController.update)
module.exports = userRoute