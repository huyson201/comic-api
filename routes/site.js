const express = require('express')
const siteRoute = express.Router()
const siteController = require('../controllers/siteController')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

siteRoute.get('/', siteController.index)
siteRoute.post('/login', authMiddleware.login, authController.login)
siteRoute.post('/register', authMiddleware.register, authController.register)
siteRoute.post('/logout', authController.logout)
siteRoute.post('/refresh-token', authController.refreshToken)
module.exports = siteRoute