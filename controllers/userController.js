const { User } = require('../models')
const bcrypt = require('bcrypt');


class UserController {
    //get all users
    async index(req, res) {
        let { limit, offset } = req.query
        try {
            if (limit && offset) {
                let users = await User.findAll({ offset: +offset, limit: +limit })
                return res.json({
                    msg: "success",
                    data: users
                })
            }
            let users = await User.findAll()
            return res.json({
                msg: "success",
                data: users
            })
        } catch (err) {
            return res.send(err)
        }

    }

    // get user by uuid
    async getById(req, res) {
        let userId = req.params.uuid
        try {
            let user = await User.findByPk(userId)
            res.json({
                msg: 'success',
                data: user
            })
        }
        catch (err) {
            res.send(err)
        }
    }

    // create new user
    async create(req, res) {
        // get request data
        let { user_email, user_password, user_name } = req.body

        // hash password
        let hash = bcrypt.hashSync(user_password, 10)

        // create a new user
        try {
            let user = await User.create({ user_email, user_password: hash, user_name })
            return res.json({
                msg: "success",
                data: user
            })
        }
        catch (err) {
            console.log(err)
            return res.json({ error: "something error" })
        }

    }

    // update user
    async update(req, res) {
        let data = req.body
        let uuid = req.params.uuid
        try {
            let user = await User.findByPk(uuid)
            user.update(data)
            return res.json({
                msg: "update success",
                data: user
            })
        }
        catch (err) {
            return res.send(err)
        }
    }
}
const userController = new UserController
module.exports = userController