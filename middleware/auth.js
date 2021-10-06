const validator = require('validator');
const { User } = require('../models')
const jwt_decode = require('jwt-decode')
const jwt = require('jsonwebtoken');
class AuthMiddleware {

    async login(req, res, next) {
        if (Object.keys(req.body).length === 0) return res.status(202).json({ message: "require email and password" })
        let { user_email, user_password } = req.body

        if (!user_email || user_email === "") return res.status(202).json({ message: "email required!" })

        if (!validator.isEmail(user_email)) return res.status(202).json({ message: "email not valid" })

        if (!user_password || user_password === "") return res.status(202).json({ message: "password required!" })

        if (!validator.isLength(user_password, { min: 6 })) return res.status(202).json({ message: "require password length > 6 " })

        return next()
    }

    async checkUserToken(req, res, next) {
        let token
        let uuid = req.params.uuid
        let { user_role, user_uuid, user_email } = req.body

        if (user_role || user_uuid || user_email) return res.json({ msg: 'data invalid' })

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1]
            try {
                let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
                if (uuid === decoded.user_uuid) return next()
                res.json({ msg: 'user token invalid' })
            }
            catch (err) {
                return res.send(err)
            }


        }

        return res.status(401).json({ code: 401, name: 'Access denied', message: 'Invalid token provided.' });
    }
}

const authMiddleware = new AuthMiddleware

module.exports = authMiddleware