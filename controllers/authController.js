const { User } = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
class AuthController {


    //login function
    async login(req, res) {
        let { user_email, user_password } = req.body

        try {
            // get user by email
            let user = await User.findOne({ where: { user_email } })
            if (user === null) return res.json({ msg: "email not exist!" })

            // check password
            let compare = bcrypt.compareSync(user_password, user.user_password)

            if (!compare) return res.json({ msg: "password not invalid" })

            // generate token and refresh token
            let payload = { ...user.dataValues, user_password: undefined, remember_token: undefined }

            let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })

            let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

            // save refresh token to user
            user.update({ remember_token: refreshToken })

            return res.json({
                msg: "login successfully",
                data: {
                    user,
                    token: token,
                    refreshToken: refreshToken
                }
            })

        }
        catch (err) {
            console.log(err)
            return res.json({ error: "something error" })
        }

    }

    // create new user
    async register(req, res) {
        // get request data
        let { user_email, user_password, user_name, confirm_password } = req.body

        if (!confirm_password || confirm_password !== user_password) return res.json({
            msg: "confirm password invalid"
        })

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

    // logout
    logout(req, res) {
        return res.json({
            msg: "logout successfully"
        })
    }

    async refreshToken(req, res) {
        let refreshToken = req.body.refreshToken

        try {
            let user = await User.findOne({ where: { remember_token: refreshToken } })
            if (!user) return res.json({ msg: "refresh token not exist" })
            // check token
            try {
                // check expired
                let { exp } = jwt_decode(refreshToken)
                if (Date.now() >= exp * 1000) return res.json({ msg: "refresh token expired" })

                // verify token
                let decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                if (!decoded) return res.json({ err: "token invalid" })

                // generate token and refresh token
                let payload = { ...user.dataValues, user_password: undefined, remember_token: undefined }

                let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })
                console.log(user)
                return res.json({
                    msg: "success",
                    data: user,
                    token: token
                })

            } catch (err) {
                // err
                console.log(err)
                return res.json({ err: "error verify refresh token" })
            }

        } catch (err) {
            return res.json({ err: "something error!" })
        }
    }

}

const authController = new AuthController;

module.exports = authController