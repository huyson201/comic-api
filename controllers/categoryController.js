const { Category } = require('../models')

class CategoryController {
    async index(req, res) {
        return res.json({
            categories: "categories"
        })
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