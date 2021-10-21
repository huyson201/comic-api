const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth')
const userMiddleware = require('../middleware/user')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

userRoute.get('/', authMiddleware.checkUserToken, userController.index)
userRoute.get('/:uuid', authMiddleware.checkUserToken, userController.getById)

userRoute.get('/:uuid/follows', userController.getFollows)

userRoute.post('/', userController.create)

userRoute.patch('/', authMiddleware.checkUserToken, upload.single('user_image'), userMiddleware.checkUpdateData, userController.update)

userRoute.patch('/change-password', authMiddleware.checkUserToken, userController.changePassword)

module.exports = userRoute