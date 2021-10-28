
const checkAdminRole = (req, res, next) => {
    if (req.user.user_role !== 'admin') return res.status(403).send("Don't have permission")
    return next()
}

module.exports = { checkAdminRole }