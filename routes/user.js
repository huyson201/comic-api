const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/userController')


const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

userRoute.get('/:uuid', userController.getById)
userRoute.patch('/change-password', userController.changePassword)
userRoute.patch('/', upload.single('user_image'), userController.update)
userRoute.get('/:uuid/follows', userController.getFollows)




module.exports = userRoute