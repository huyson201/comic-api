const express = require('express')
const comicRoute = express.Router()
const comicController = require('../controllers/comicController')
comicRoute.get('/', comicController.index)
comicRoute.get('/:id(([0-9])+)', comicController.getById)
module.exports = comicRoute