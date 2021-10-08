const { Chapter } = require('../models')

class ChapterController {
    async index(req, res) {
        try {
            let chapters = await Chapter.findAll()

            return res.json({
                msg: 'success',
                data: chapters
            })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getById(req, res) {
        let chapterId = req.params.id
        if (!chapterId) return res.status(404).json({ msg: "not found" })
        try {
            let chapter = await Chapter.findByPk(chapterId)
            return res.json({
                msg: "success",
                data: chapter
            })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }
}

const chapterController = new ChapterController
module.exports = chapterController