const { User } = require('../models')
const bcrypt = require('bcrypt');


class UserController {
    //get all users
    async index(req, res) {
        let { limit, offset, sort } = req.body
        let uuid = req.user_uuid
        const query = {}
        if (offset) query.offset = +offset
        if (limit) query.limit = +limit

        if (sort) {
            let col = sort.split(':')[0]
            let value = sort.split(':')[1]
            query.order = [[col, value]]
        }
        try {
            let user = await User.findByPk(uuid)
            if (!user) return res.json({ err: "you mustn't login before accessing!" })
            if (user.user_role !== "admin") return res.json({ err: "you don't have permission!" })

            let users = await User.findAll(query)

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
        let uuid = req.user_uuid
        console.log(uuid)
        console.log(userId)
        try {
            let user = await User.findByPk(uuid)
            if (!user) return res.json({ err: "you mustn't login before accessing!" })

            if (user.user_role !== "admin" && uuid !== userId) return res.json({ err: "you don't have permission!" })

            let userDetail = await User.findByPk(userId)
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
        let { user_email, user_password, user_name, user_role } = req.body

        if (!user_role) user_role = "user"


        // create a new user
        try {
            let user = await User.create({ user_email, user_password, user_name, user_role })
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
        let uuid = req.user_uuid
        console.log(uuid)
        try {
            let user = await User.findByPk(uuid)
            if (data.user_role && user.user_role === 'user') return res.json({ err: `don't have permission` })
            user = await user.update(data)
            return res.json({
                msg: "update success",
                data: user
            })
        }
        catch (err) {
            return res.send(err)
        }
    }

    async changePassword(req, res) {
        let { old_password, new_password } = req.body
        let uuid = req.user_uuid

        try {
            let user = await User.findByPk(uuid)
            if (!user) return res.json({ err: "user not found" })

            // verify password
            let verifyPassword = bcrypt.compareSync(old_password, user.user_password)
            if (!verifyPassword) res.json({ err: "old password invalid" })
            user.user_password = new_password
            user = await user.save()
            return res.json({
                msg: "success",
                data: user
            })

        } catch (err) {

        }
    }
}
const userController = new UserController
module.exports = userController