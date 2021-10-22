const { Follow } = require("../models")
class FollowController {
    async index(req, res) {
        let { user_uuid, comic_id } = req.query
        const query = { where: {} }
        if (user_uuid) query.where.user_uuid = user_uuid
        if (comic_id) query.where.comic_id = +comic_id

        try {
            let follows = await Follow.findAndCountAll(query)
            return res.status(200).json({
                code: 200,
                name: "",
                message: "success",
                data: follows
            })
        } catch (error) {
            console.log(error)
            return res.send(error)
        }
    }

    async create(req, res) {
        let { comic_id } = req.body
        let user_uuid = req.user_uuid
        let query = {}

        try {
            let existFollow = await Follow.findOne({ where: { user_uuid, comic_id } })
            if (existFollow) {
                return res.status(200).json({
                    code: '',
                    name: "",
                    message: "follow comics exist!",
                    data: existFollow
                })
            }

            let follow = await Follow.create({ user_uuid, comic_id })
            return res.status(201).json({
                code: 201,
                name: "CREATED_FOLLOW",
                message: "create success ",
                data: follow
            })
        } catch (error) {
            return res.send(error)
        }
    }

    async delete(req, res) {
        let { follow_id } = req.body
        if (follow_id) {
            try {
                let follow = await Follow.findByPk(follow_id)
                if (!follow) return res.status(404).json({ code: 404, name: "", message: "not found!" })
                follow = await follow.destroy()
                return res.status(200).json({
                    code: 200,
                    name: "",
                    message: "delete success",
                    data: follow
                })
            } catch (error) {
                return res.send(error)
            }
        }
        return res.status(404).json({ code: 404, name: "", message: "not found!" })

    }
}

const followController = new FollowController
module.exports = followController