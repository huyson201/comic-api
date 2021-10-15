const { Rate } = require('../models')
class RateController {
    async index(req, res) {
        try {
            let rates = await Rate.findAll()
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
}

const rateController = new RateController
module.exports = rateController