const { Comic, sequelize } = require('../models')
const { Op } = require("sequelize");
class ComicController {

    async index(req, res) {
        let { limit, offset, sort } = req.query

        let query = {}

        if (limit) query.limit = +limit

        if (offset) query.offset = +offset

        if (sort) {
            let col = sort.split(':')[0]
            let value = sort.split(':')[1]
            query.order = [[col, value]]
        }

        query.include = [
            {
                association: "chapters",
                attributes: ['chapter_id', 'comic_id', 'chapter_name', 'updatedAt', 'createdAt'],
                required: true,
            }
        ]


        try {

            let comics = await Comic.findAll(query)
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
            let comic = await Comic.findByPk(comicId, { include: { association: "categories" } })

            return res.status(202).json({
                msg: 'success',
                data: comic
            })
        }
        catch (err) {
            console.log(err)
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

    async filter(req, res) {
        let { status, categories } = req.query

        let query = {
            where: {
                [Op.and]: []
            }
        }

        query.include = [
            {
                association: "categories",
                through: {
                    attributes: []
                },
                required: true,
            }
        ]

        if (status) {
            query.where[Op.and].push({ comic_status: status })
        }

        if (categories) {
            categories = JSON.parse(categories)
            query.where[Op.and].push({ '$categories.category_id$': { [Op.in]: categories } })
        }
        console.log(Symbol('and'))

        try {
            let comics = await Comic.findAll(query)
            return res.json(comics)
        }

        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

}

const comicController = new ComicController
module.exports = comicController