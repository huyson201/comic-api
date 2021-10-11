const { Category } = require('../models')

class CategoryController {
    async index(req, res) {
        try {
            let categories = await Category.findAll()
            return res.json({
                msg: "success",
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
        if (!id) return res.json({ msg: "not found" })
        try {
            let category = await Category.findByPk(id)
            return res.json({
                msg: "success",
                data: category
            })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }

    }
    async getComicsByCategory(req, res) {
        let cateId = req.params.id
        try {
            let categories = await Category.findAll({
                where: {
                    category_id: cateId
                },
                include: 'comics'
            })

            return res.json({
                msg: "success",
                data: categories
            })
        }
        catch (err) {
            return res.json({
                name: cateId
            })
        }

    }
}
const categoryController = new CategoryController
module.exports = categoryController