const express = require('express')
const categoryRoute = express.Router()
const categoryController = require('../controllers/categoryController')
categoryRoute.get('/', categoryController.index)
categoryRoute.get('/:id(([0-9])+)/comics', categoryController.getComicsByCategory)

module.exports = categoryRoute