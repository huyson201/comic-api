const express = require('express')
const siteRoute = express.Router()
const siteController = require('../controllers/siteController')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

siteRoute.get('/', siteController.index)
siteRoute.get('/images/:key', siteController.getImage)

siteRoute.post('/login', authMiddleware.checkFiled, authController.login)
siteRoute.post('/register', authMiddleware.checkFiled, authController.register)
siteRoute.post('/logout', authController.logout)
siteRoute.post('/refresh-token', authController.refreshToken)
siteRoute.post('/forget-password', siteController.forgetPassword)
siteRoute.post('/forget-password/confirm', siteController.forgetPasswordConfirm)
siteRoute.post('/reset-password', authMiddleware.checkResetPasswordToken, siteController.resetPassword)

module.exports = siteRoute