const express = require('express')
const adminComicRoute = express.Router()
const comicController = require('../../controllers/comicController')
const upload = require('multer')({ dest: 'uploads/' })

adminComicRoute.post('/', upload.single('comic_img'), comicController.create)
adminComicRoute.patch('/:id', upload.single('comic_img'), comicController.update)
adminComicRoute.delete('/:id', comicController.delete)

module.exports = adminComicRoute