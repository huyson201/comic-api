const express = require('express')
const adminChapterRoute = express.Router()
const chapterController = require('../../controllers/chapterController')
const upload = require('multer')({ dest: 'uploads/' })
adminChapterRoute.post('/create', chapterController.create)
adminChapterRoute.post('/upload', upload.single('img'), chapterController.updriver)
adminChapterRoute.patch('/:id', chapterController.updateImgs)
adminChapterRoute.patch('/img/:id', upload.single('img'), chapterController.updateImg)
adminChapterRoute.patch('/delete/img/:id', chapterController.deleteImg)
adminChapterRoute.delete('/delete/:id', chapterController.delete)

module.exports = adminChapterRoute