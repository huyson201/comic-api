const { Rate } = require('../models')
class RateController {
    async index(req, res) {
        let { user_uuid, comic_id } = req.query

        const query = { where: {} }

        if (user_uuid) query.where.user_uuid = user_uuid

        if (comic_id) query.where = { ...query.where, comic_id: +comic_id }

        try {

            let rates = await Rate.findAll(query)
            return res.json({
                msg: "success",
                data: rates
            })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async create(req, res) {
        let { rate_star, comic_id } = req.body
        let user_uuid = req.user_uuid
        if (rate_star < 1 || rate_star > 5) return res.json({ code: 0, name: "", message: "star invalid" })
        try {
            let currentRate = await Rate.findOne({
                where: {
                    user_uuid: user_uuid
                }
            })

            if (currentRate) {
                currentRate.update({ rate_star: rate_star })
                return res.json({
                    msg: "success",
                    data: currentRate
                })
            }

            let rate = await Rate.create({ rate_star, user_uuid, comic_id })

            return res.json({
                msg: "success",
                data: rate
            })
        }
        catch (err) {
            return res.send(err)
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).json({ code: 404, name: "", message: "page not found" })

        try {
            let rate = await Rate.findByPk(id)
            if (!rate) return res.status(404).json({ code: 404, name: "", message: "page not found" })

            return res.status(200).json({
                code: 200,
                name: "",
                message: "success",
                data: rate
            })
        } catch (error) {

        }
    }

    async sumRate(req, res) {
        let { comic_id } = req.query
        if (!comic_id) return res.status(404).send("not found")
        let query = { where: { comic_id: +comic_id } }
        try {
            let sum_rate = await Rate.sum("rate_star", query)
            return res.json({ code: 200, name: "", message: "", data: { comic_id, sum_rate } })
        } catch (error) {
            console.log(error)
            return res.json({ code: 0, name: "", message: "Something error!" })
        }

    }
}

const rateController = new RateController
module.exports = rateController