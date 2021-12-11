const { Comment, sequelize, Comic } = require('../models')
const sendCommentNotify = require('../queues/comment-notify.queue')
class CommentController {
    async index(req, res) {
        const { parentId } = req.query

        const query = {
            where: {},
            order: [['createdAt', 'DESC']],
            include: [{
                association: 'user_info',
                attributes: ['user_name', 'user_image', 'user_email']
            }]
        }

        if (parentId) {
            query.where.parent_id = parentId
        }

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

        const t = await sequelize.transaction()

        try {
            let comment = await Comment.create({ comic_id, comment_content, parent_id, user_uuid }, { transaction: t })

            if (parent_id !== 0) {
                let parentComment = await Comment.findByPk(parent_id)
                let actorId = parentComment.user_uuid

                if (actorId !== user_uuid) {

                    let comic = await Comic.findByPk(comic_id, { attributes: ['comic_name'] })

                    let notify_msg = `${req.user.user_name} đã trở lời bình luận của bạn trong ${comic.comic_name}`

                    let notify = {
                        notifier_id: user_uuid,
                        actor_id: actorId,
                        comment_id: comment.comment_id,
                        notification_message: notify_msg
                    }

                    sendCommentNotify(notify)
                }
            }

            t.commit()

            return res.status(201).json({
                code: 201,
                name: "",
                message: "create success",
                data: comment
            })
        } catch (error) {
            t.rollback()
            console.log(error)
            return res.status(400).send(error.message)
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

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).send('comment id not found')

        try {
            let comment = await Comment.findByPk(id)
            return res.status(200).json({
                data: comment
            })
        } catch (error) {
            return res.status(400).send(error.message)
        }
    }


}

const commentController = new CommentController
module.exports = commentController