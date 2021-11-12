const { Comic, sequelize, Comment, ComicCategory, Chapter } = require('../models')
const { Op } = require("sequelize");
const { uploadFile, googleDrive, searchParams } = require('../util');


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
        query.include = [
            {
                association: "chapters",
                attributes: ['chapter_id', 'chapter_name'],
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

            },
             {
                association: "chapters",
                attributes: ['chapter_id', 'chapter_name'],
                required: true,
                order: [["chapter_id", "desc"]],
                limit: 1,
                offset: 0
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
                attributes: ['chapter_id', 'comic_id', 'createdAt', 'updatedAt'],
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
                nested: true,
                include: [
                    {
                        association: "user_info",
                        attributes: ["user_name", "user_email", "user_image"]
                    }
                ]
            },
            {
                association: "user_info",
                attributes: ["user_name", "user_email", "user_image"]
            }
        ]


        try {


            let comments = await Comment.findAll(queryComment)
            comments = comments.map(el => {
                let comment = el.get({ plain: true })
                comment.subComments = el.subComments.sort((a, b) => {
                    let dateA = new Date(a)
                    let dateB = new Date(b)

                    return dateA > dateB ? 1 : -1
                })

                return comment
            })

            return res.status(200).json({
                code: 200,
                name: "",
                message: "success",
                data: comments
            })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }

    }

    async create(req, res) {
        let { comic_name, comic_desc, comic_author, comic_status, comic_view, categories } = req.body
        const t = await sequelize.transaction()
        try {

            let comic_img = ''
            categories = categories.split(',')

            //upload comic img
            if (req.file) {
                let imgUrl = await uploadFile(req.file)
                comic_img = imgUrl
            }


            // create comic
            let comic = await Comic.create({ comic_name, comic_desc, comic_author, comic_status, comic_view: +comic_view, comic_img }, { transaction: t })

            // create comic's categories
            for (let index in categories) {
                let category = +categories[index]
                await ComicCategory.create({ comic_id: comic.comic_id, category_id: category })
            }

            await t.commit()

            return res.status(200).json({ data: comic, message: "Create comic successfully!" })

        } catch (error) {
            await t.rollback()
            return res.status(400).send(error.message)
        }
    }

    async update(req, res) {
        let data = req.body
        let { categories } = req.body
        let comic_id = req.params.id

        const t = await sequelize.transaction()

        try {
            let comic = await Comic.findByPk(comic_id)

            let comic_img = ''


            //upload comic img
            if (req.file) {
                if (comic.comic_img && comic.comic_img !== '') {
                    let fileId = searchParams(comic.comic_img).get('id')
                    googleDrive.updateFileDrive(fileId, req.file)
                    data.comic_img = comic.comic_img
                }
                else {
                    let imgUrl = await uploadFile(req.file)
                    data.comic_img = imgUrl
                }

            }

            if (categories) {
                categories = categories.split(',')
                categories = [...new Set(categories)]
                const res = await ComicCategory.destroy({ where: { comic_id } })
                console.log(res, "result")
                let categoryData = []

                for (let index in categories) {
                    let category_id = +categories[index]
                    categoryData.push({ comic_id, category_id })
                }

                await ComicCategory.bulkCreate(categoryData, { transaction: t })
                delete data.categories
            }


            // update comic

            await comic.update({ ...data }, { transaction: t })




            await t.commit()

            return res.status(200).json({ data: comic, message: "Update comic successfully!" })

        } catch (error) {
            console.log(error)
            await t.rollback()
            return res.status(400).send(error.message)
        }
    }

    async delete(req, res) {
        let comic_id = req.params.id
        const t = await sequelize.transaction()
        try {
            await Comic.destroy({ where: { comic_id } }, { transaction: t })
            await ComicCategory.destroy({ where: { comic_id } }, { transaction: t })
            t.commit()
            return res.status(204).send()
        } catch (error) {
            console.log(error)
            t.rollback()
            return res.status(400).send(error.message)
        }
    }


}

const comicController = new ComicController
module.exports = comicController