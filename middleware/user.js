
class UserMiddleware {
    checkUpdateData(req, res, next) {
        let { user_email, user_role, user_uuid, remember_token } = req.body
        if (user_email || user_role || user_uuid === req.user_uuid || remember_token) return res.status(422).json({ code: 422, name: "", message: "Data invalid" })
        return next()
    }
}

const userMiddleware = new UserMiddleware

module.exports = userMiddleware