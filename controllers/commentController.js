const { Comment } = require('../models')
class CommentController {
    async index(req, res) {
        const query = {}
        try {
            let comments = await Comment.findAndCountAll(query)
            return res.status(200).json({
                code: 200,
                name: "",
                message: "success",
                data: comments
            })
        } catch (error) {
            console.log(error)
            return res.send(error)
        }
    }
    async create(req, res) {
        let { comic_id, comment_content, parent_id } = req.body
        let user_uuid = req.user.user_uuid

        if (!parent_id) parent_id = 0

        try {
            let comment = await Comment.create({ comic_id, comment_content, parent_id, user_uuid })
            return res.status(201).json({
                code: 201,
                name: "",
                message: "create success",
                data: comment
            })
        } catch (error) {
            console.log(error)
            return res.send(error)
        }
    }
    async count(req, res) {
        let comic_id = req.query.comic_id
        if (!comic_id) return res.status(404).json({ code: 404, name: "", message: "not found!" })
        try {
            let count = await Comment.count({ where: { comic_id, parent_id: 0 } })
            return res.status(200).json({ code: 200, name: "", message: "success", data: count })
        } catch (error) {
            console.log(error)
            return res.send(error)
        }
    }
}

const commentController = new CommentController
module.exports = commentController