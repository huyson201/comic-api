const express = require('express')
const rateRoute = express.Router()
const rateController = require('../controllers/rateController')
const authMiddleware = require('../middleware/auth')

rateRoute.get('/', rateController.index)
rateRoute.post('/', authMiddleware.checkUserToken, rateController.create)
module.exports = rateRoute