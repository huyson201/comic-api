const validator = require('validator');
const { User } = require('../models')

class AuthMiddleware {

    async login(req, res, next) {
        if (Object.keys(req.body).length === 0) return res.status(202).json({ message: "require email and password" })
        let { user_email, user_password } = req.body

        if (!user_email || user_email === "") return res.status(202).json({ message: "email required!" })

        if (!validator.isEmail(user_email)) return res.status(202).json({ message: "email not valid" })

        if (!user_password || user_password === "") return res.status(202).json({ message: "password required!" })

        if (!validator.isLength(user_password, { min: 6 })) return res.status(202).json({ message: "require password length > 6 " })

        next()
    }

    async register(req, res, next) {
        if (Object.keys(req.body).length === 0) return res.status(202).json({ message: "user info null" })

        let { user_email, user_password, user_name } = req.body

        if (!user_email || user_email === "") return res.status(202).json({ message: "email required!" })

        if (!validator.isEmail(user_email)) return res.status(202).json({ message: "email not valid" })

        if (await User.findOne({ where: { user_email: user_email } }) !== null) {
            return res.status(202).json({ message: "email exist!" })
        }

        if (!user_password || user_password === "") return res.status(202).json({ message: "password required!" })

        if (!validator.isLength(user_password, { min: 6 })) return res.status(202).json({ message: "require password length > 6 " })

        if (!user_name || user_name === "") return res.status(202).json({ message: "user name required!" })

        next()
    }
}

const authMiddleware = new AuthMiddleware

module.exports = authMiddleware