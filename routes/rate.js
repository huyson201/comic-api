const express = require('express')
const rateRoute = express.Router()
const rateController = require('../controllers/rateController')

rateRoute.get('/', rateController.index)
rateRoute.post('/', rateController.create)
module.exports = rateRoute