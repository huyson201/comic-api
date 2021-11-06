const express = require('express')
const adminChapterRoute = express.Router()
const chapterController = require('../../controllers/chapterController')

adminChapterRoute.delete('/delete/:id', chapterController.delete)

module.exports = adminChapterRoute