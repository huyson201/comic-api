const express = require('express')
const comicRoute = express.Router()
const comicController = require('../controllers/comicController')
comicRoute.get('/', comicController.index)
comicRoute.get('/:id(([0-9])+)', comicController.getById)
comicRoute.get('/:id(([0-9])+)/categories', comicController.getCategories)
comicRoute.get('/:id(([0-9])+)/chapters', comicController.getChapters)
comicRoute.get('/search', comicController.searchByKey)
comicRoute.get('/filter', comicController.filter)
module.exports = comicRoute