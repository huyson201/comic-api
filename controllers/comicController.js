const { Comic, sequelize, Comment } = require('../models')
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
            return res.status(200).json({
                message: "success",
                data: comics
            })

        }
        catch (err) {
            return res.status(400).send(err.message)
        }
    }

    async getById(req, res) {
        let comicId = req.params.id
        if (!comicId) return res.status(404).send("comic id not found")
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
                message: 'success',
                data: comic
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }
    }

    async searchByKey(req, res) {
        let { q, offset, limit, sort } = req.query
        if (!q) return res.status(400).json({ err: "keyword not found!" })
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
            return res.status(200).json({
                message: "success",
                data: comics
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
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
            return res.status(200).json(comics)
        }

        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
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
                message: 'success',
                data: comic
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
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
                message: 'success',
                data: comic
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err)
        }
    }

    async getComments(req, res) {
        let comic_id = req.params.id
        let { offset, limit, sort } = req.query
        const queryComic = {}
        const queryComment = {}

        if (!comic_id) return res.status(404).send("comic id not found")
        queryComic.attributes = ["comic_id", 'comic_name']
        queryComic.subQuery = false

        if (offset) queryComment.offset = +offset
        if (limit) queryComment.limit = +limit
        if (sort) {
            let col = sort.split(':')[0]
            let value = sort.split(':')[1]
            queryComment.order = [[col, value]]
        }

        queryComment.where = { comic_id, parent_id: 0 }

        queryComment.include = [
            {
                association: 'subComments',
                require: true,
                nested: true
            }
        ]


        try {
            let comic = (await Comic.findByPk(comic_id, queryComic)).toJSON()
            let comments = await Comment.findAll(queryComment)
            comic.comments = comments

            return res.status(200).json({
                code: 200,
                name: "",
                message: "success",
                data: comic
            })
        } catch (error) {
            console.log(error)
            return res.status(400).send(err.message)
        }

    }




}

const comicController = new ComicController
module.exports = comicController