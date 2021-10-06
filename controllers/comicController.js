const { Comic } = require('../models')
const { Op } = require("sequelize");
class ComicController {

    async index(req, res) {
        let { limit, offset } = req.query

        try {
            if (limit && offset) {
                let comics = await Comic.findAll({ offset: +offset, limit: +limit })
                return res.json({
                    msg: "success",
                    data: comics
                })
            }
            let comics = await Comic.findAll()
            return res.json({
                msg: "success",
                data: comics
            })

        }
        catch (err) {
            return res.send(err)
        }
    }

    async getById(req, res) {
        let comicId = req.params.id
        if (!comicId) return res.status(404).send("not found")

        try {
            let comic = await Comic.findByPk(comicId,
                {
                    include: 'categories',
                    through: {
                        attributes: [],
                    }
                })

            return res.status(202).json({
                msg: 'success',
                data: comic
            })
        }
        catch (err) {
            return res.send(err)
        }
    }

    async searchByKey(req, res) {
        let key = req.query.q
        if (!key) return res.json({ msg: "keyword not found!" })

        try {
            let comics = await Comic.findAll({
                where: {
                    comic_name: {
                        [Op.like]: `%${key}%`,
                    }
                }
            })
            console.log("comics")
            return res.json({
                msg: "success",
                data: comics
            })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }
}

const comicController = new ComicController
module.exports = comicController