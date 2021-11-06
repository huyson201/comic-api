const express = require('express')
const chapterRoute = express.Router()
const chapterController = require('../controllers/chapterController')

chapterRoute.get('/', chapterController.index)
chapterRoute.get('/:id(\\d+$)', chapterController.getById)
chapterRoute.get('/comics/:id(\\d+$)', chapterController.getByComicId)
module.exports = chapterRoute