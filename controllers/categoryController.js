const { Category, Comic, sequelize } = require('../models')

class CategoryController {
    async index(req, res) {
        try {
            let categories = await Category.findAll()
            return res.status(200).json({
                message: "success",
                data: categories
            })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }

    }
    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(400).json({ message: "id not found" })
        try {
            let category = await Category.findByPk(id)
            return res.status(200).json({
                message: "success",
                data: category
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }

    }
    async getComicsByCategory(req, res) {
        let cateId = req.params.id
        let { offset, limit, sort } = req.query
        let query = {

        }
        query.subQuery = false
        query.where = { category_id: cateId }

        if (offset) query.offset = +offset
        if (limit) query.limit = +limit

        if (sort) {
            let col = sort.split(':')[0]
            let value = sort.split(':')[1]
            query.order = [[sequelize.literal('`comics`.' + '\`' + col + '\`'), value]]
        }

        query.include = [
            {
                association: 'comics',
                require: true,
                through: {
                    attributes: []
                },

            }
        ]

        try {
            let categories = await Category.findAndCountAll(query)
            return res.status(200).json({
                message: "success",
                data: categories
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }

    }
}
const categoryController = new CategoryController
module.exports = categoryController