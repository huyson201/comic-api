const { Rate } = require('../models')
class RateController {
    async index(req, res) {
        let { user_uuid, comic_id } = req.query

        const query = { where: {} }

        if (user_uuid) query.where.user_uuid = user_uuid

        if (comic_id) query.where = { ...query.where, comic_id: +comic_id }

        try {

            let rates = await Rate.findAndCountAll(query)
            return res.status(200).json({
                message: "success",
                data: rates
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }
    }

    async create(req, res) {
        let { rate_star, comic_id } = req.body
        let user_uuid = req.user.user_uuid
        if (rate_star < 1 || rate_star > 5) return res.status(400).send("star invalid")
        try {
            let currentRate = await Rate.findOne({
                where: {
                    user_uuid: user_uuid
                }
            })

            if (currentRate) {
                currentRate.update({ rate_star: rate_star })
                return res.status(200).json({
                    message: "success",
                    data: currentRate
                })
            }

            let rate = await Rate.create({ rate_star, user_uuid, comic_id })

            return res.status(200).json({
                message: "success",
                data: rate
            })
        }
        catch (err) {
            return res.status(400).send(err.message)
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(400).send("id not found")

        try {
            let rate = await Rate.findByPk(id)
            if (!rate) return res.status(400).send("rate not found")

            return res.status(200).json({
                code: 200,
                name: "",
                message: "success",
                data: rate
            })
        } catch (error) {
            return res.status(400).send(error.message)
        }
    }

    async sumRate(req, res) {
        let { comic_id } = req.query
        if (!comic_id) return res.status(404).send("not found")
        let query = { where: { comic_id: +comic_id } }
        try {
            let sum_rate = await Rate.sum("rate_star", query)
            let count = await Rate.count(query)

            return res.status(200).json({ code: 200, name: "", message: "", data: { comic_id, sum_rate, count } })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }

    }
}

const rateController = new RateController
module.exports = rateController