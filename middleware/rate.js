const { canUpdate } = require('../permissions/rate')
const authUpdateRate = (req, res, next) => {
    if (!canUpdate(req.user, req.body.user_uuid)) {
        return res.status(403).send("Don't have permission!")
    }

    return next()
}

module.exports = { authUpdateRate }