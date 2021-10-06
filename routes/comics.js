const express = require('express')
const comicsRoute = express.Router()
const comicController = require('../controllers/comicController')
comicsRoute.get('/', comicController.index)
comicsRoute.get('/:id(([0-9])+)', comicController.getById)
module.exports = comicsRoute