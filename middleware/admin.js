
const checkAdminRole = (req, res, next) => {
    if (req.user_role !== 'admin') return res.status(403).json({ code: 403, name: "Forbidden", message: "Don't have permission" })
    return next()
}

module.exports = { checkAdminRole }