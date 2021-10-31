const { canGetDetail, canUpdate, canGetFollows } = require('../permissions/user')

class UserMiddleware {
    authGetDetail(req, res, next) {
        if (!canGetDetail(req.user, req.params.uuid)) {
            return res.status(403).send("Don't have permission!")
        }

        return next()
    }

    authUpdate(req, res, next) {

        if (!canUpdate(req.user, req.body.user_uuid)) {
            return res.status(403).send("Don't have permission!")
        }

        return next()
    }

    authGetFollows(req, res, next) {
        if (!canGetFollows(req.user, req.params.uuid)) {
            return res.status(403).send("Don't have permission!")
        }
        return next()
    }
}

const userMiddleware = new UserMiddleware

module.exports = userMiddleware