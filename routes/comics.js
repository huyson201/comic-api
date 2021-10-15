const express = require('express')
const comicRoute = express.Router()
const comicController = require('../controllers/comicController')
comicRoute.get('/', comicController.index)
comicRoute.get('/:id(\\d+$)', comicController.getById)
comicRoute.get('/:id(\\d+)/categories', comicController.getCategories)
comicRoute.get('/:id(\\d+)/chapters', comicController.getChapters)
comicRoute.get('/search', comicController.searchByKey)
comicRoute.get('/filter', comicController.filter)
comicRoute.get('/:id(\\d+)/comments', comicController.getComments)

module.exports = comicRoute