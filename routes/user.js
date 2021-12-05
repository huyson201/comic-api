const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require("../middleware/auth")
const userMiddleware = require("../middleware/user")
const role = require('../config/role')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

userRoute.get('/:uuid', authMiddleware.checkUserToken, authMiddleware.authRole([role.ADMIN, role.USER]), userMiddleware.authGetDetail, userController.getById)

userRoute.patch('/change-password', userController.changePassword)

userRoute.patch('/:uuid', authMiddleware.checkUserToken, upload.single('user_image'), authMiddleware.authRole([role.ADMIN, role.USER]), userMiddleware.authUpdate, userController.update)

userRoute.get('/:uuid/follows', authMiddleware.checkUserToken, authMiddleware.authRole([role.ADMIN,role.USER]), userMiddleware.authGetFollows, userController.getFollows)
userRoute.get('/:uuid/histories', authMiddleware.checkUserToken, userController.getHistories)

userRoute.get('/:uuid/notifications', userController.getNotifications)


module.exports = userRoute