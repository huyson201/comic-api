const express = require('express')
const rateRoute = express.Router()
const rateController = require('../controllers/rateController')
const authMiddleware = require('../middleware/auth')

rateRoute.get('/', rateController.index)
rateRoute.get('/:id(\\d+$)', rateController.getById)
rateRoute.post('/', authMiddleware.checkUserToken, rateController.create)
rateRoute.get("/sum", rateController.sumRate)
module.exports = rateRoute