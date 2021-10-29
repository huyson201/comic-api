const express = require('express')
const adminUserRoute = express.Router()
const userController = require('../../controllers/userController')
const authMiddleware = require('../../middleware/auth')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


adminUserRoute.get("/", userController.index)
adminUserRoute.post('/', userController.create)

module.exports = adminUserRoute