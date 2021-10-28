const validator = require('validator');
const { User } = require('../models')
const jwt_decode = require('jwt-decode')
const jwt = require('jsonwebtoken');
class AuthMiddleware {

    async checkFiled(req, res, next) {
        if (Object.keys(req.body).length === 0) return res.status(400).send("require email and password")
        let { user_email, user_password } = req.body

        if (!user_email || user_email === "") return res.status(400).send("email required!")

        if (!validator.isEmail(user_email)) return res.status(400).send("email not valid")

        if (!user_password || user_password === "") return res.status(400).send("password required!")

        if (!validator.isLength(user_password, { min: 6 })) return res.status(400).send("require password length > 6 ")

        return next()
    }

    async checkUserToken(req, res, next) {
        let token

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1]
            try {
                let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
                let user = await User.findByPk(decoded.user_uuid)
                if (!user) return res.status(401).send("user not found")
                req.user = user
                return next()
            }
            catch (err) {
                return res.status(400).send(err.message)
            }


        }

        return res.status(401).send('Invalid token provided.');
    }

    async checkResetPasswordToken(req, res, next) {
        let token

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1]
            try {
                let decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET)
                let user = await User.findByPk(decoded.user_uuid)
                if (!user) return res.status(401).send("user not found")
                req.user = user
                return next()
            }
            catch (err) {
                return res.status(400).send(err.message)
            }


        }

        return res.status(401).send('Invalid token provided.');
    }
}

const authMiddleware = new AuthMiddleware

module.exports = authMiddleware