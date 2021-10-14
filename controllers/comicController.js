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
                order: [["chapter_id", "desc"]],
                limit: 1,
                offset: 0
            }
        ]


        try {

            let comics = await Comic.findAndCountAll(query)
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
        let query = {}
        query.include = [
            {
                association: "categories",
                through: {
                    attributes: []
                }

            },
            {
                association: "chapters",
                attributes: ['chapter_id', 'comic_id', 'chapter_name', 'createdAt', 'updatedAt'],
            }
        ]

        try {
            let comic = await Comic.findByPk(comicId, query)

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
        let { q, offset, limit, sort } = req.query
        if (!q) return res.json({ err: "keyword not found!" })
        const query = {}
        query.where = {
            comic_name: {
                [Op.like]: `%${q}%`,
            }
        }

        if (offset) query.offset = +offset
        if (limit) query.limit = +limit

        if (sort) {
            let col = sort.split(':')[0]
            let value = sort.split(':')[1]
            query.order = [[col, value]]
        }

        try {
            let comics = await Comic.findAndCountAll(query)
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
        let { status, categories, offset, limit, sort } = req.query

        const query = {
            include: [],
            where: {
                [Op.and]: []
            },

        }
        if (categories) {
            categories = JSON.parse(categories)
        }
        query.include = [
            {
                association: "categories",
                where: { 'category_id': { [Op.in]: categories } },
                attributes: [],
                through: {
                    attributes: []
                },
            }
        ]

        if (offset) query.offset = +offset
        if (limit) query.limit = +limit

        if (sort) {
            let col = sort.split(':')[0]
            let value = sort.split(':')[1]
            query.order = [[col, value]]
        }

        if (status) {
            query.where[Op.and].push({ comic_status: status })
        }





        try {
            let comics = await Comic.findAndCountAll(query)
            return res.json(comics)
        }

        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getCategories(req, res) {
        let comicId = req.params.id
        if (!comicId) return res.status(404).send("not found")
        let query = {}
        query.include = [
            {
                association: "categories",
                through: {
                    attributes: []
                }

            }
        ]


        try {
            let comic = await Comic.findByPk(comicId, query)

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

    async getChapters(req, res) {
        let comicId = req.params.id
        if (!comicId) return res.status(404).send("not found")
        let query = {}
        query.include = [
            {
                association: "chapters",
                attributes: ['chapter_id', 'comic_id', 'createdAt', 'updatedAt']
            }
        ]


        try {
            let comic = await Comic.findByPk(comicId, query)

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
}

const comicController = new ComicController
module.exports = comicController