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
module.exports = siteRoute