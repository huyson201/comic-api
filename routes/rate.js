const express = require('express')
const rateRoute = express.Router()
const rateController = require('../controllers/rateController')
const authMiddleware = require('../middleware/auth')
const { authUpdateRate } = require('../middleware/rate')

const role = require('../config/role')

rateRoute.get('/', rateController.index)
rateRoute.get('/:id(\\d+$)', rateController.getById)
rateRoute.get("/sum", rateController.sumRate)
rateRoute.post('/', authMiddleware.checkUserToken, authMiddleware.authRole([role.USER, role.ADMIN]), rateController.create)
rateRoute.patch('/:id(\\d+$)', authMiddleware.checkUserToken, authMiddleware.authRole([role.USER, role.ADMIN]), authUpdateRate, rateController.update)

module.exports = rateRoute