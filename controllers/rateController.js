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
        let { rate_star, comic_id, user_uuid } = req.body
        try {
            let currentRate = Rate.findOne({
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
}
const rateController = new RateController
module.exports = rateController