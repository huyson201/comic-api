const express = require('express')
const siteRoute = express.Router()
const siteController = require('../controllers/siteController')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

siteRoute.get('/', siteController.index)
siteRoute.get('/images/:key', siteController.getImage)

siteRoute.post('/upload', upload.single('image'), siteController.uploadDrive)

siteRoute.post('/login', authMiddleware.checkFiled, authController.login)
siteRoute.post('/register', authMiddleware.checkFiled, authController.register)
siteRoute.post('/logout', authMiddleware.checkUserToken, authController.logout)
siteRoute.post('/refresh-token', authController.refreshToken)
siteRoute.post('/forget-password', siteController.forgetPassword)
siteRoute.post('/forget-password/confirm', siteController.forgetPasswordConfirm)
siteRoute.post('/reset-password', authMiddleware.checkResetPasswordToken, siteController.resetPassword)

module.exports = siteRoute