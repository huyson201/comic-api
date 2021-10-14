const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth')

userRoute.get('/', userController.index)
userRoute.get('/:uuid', userController.getById)

userRoute.post('/', userController.create)

userRoute.patch('/', authMiddleware.checkUserToken, userController.update)
userRoute.patch('/change-password', authMiddleware.checkUserToken, userController.changePassword)
module.exports = userRoute