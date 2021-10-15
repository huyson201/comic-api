const express = require('express')
const categoryRoute = express.Router()
const categoryController = require('../controllers/categoryController')

categoryRoute.get('/', categoryController.index)
categoryRoute.get('/:id(\\d+$)', categoryController.getById)
categoryRoute.get('/:id(\\d+)/comics', categoryController.getComicsByCategory)

module.exports = categoryRoute