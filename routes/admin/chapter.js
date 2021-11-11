const express = require('express')
const adminChapterRoute = express.Router()
const chapterController = require('../../controllers/chapterController')
const upload = require('multer')({ dest: 'uploads/' })
adminChapterRoute.post('/', upload.array('chapter_imgs'), chapterController.create)
adminChapterRoute.patch('/image/:id', upload.single('chapter_img'), chapterController.updateImg)
adminChapterRoute.delete('/delete/:id', chapterController.delete)

module.exports = adminChapterRoute