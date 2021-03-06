const siteRoute = require('./site')
const categoryRoute = require('./category')
const comicRoute = require('./comics')
const userRoute = require('./user')
const chapterRoute = require('./chapter')
const rateRoute = require('./rate')
const followRoute = require('./follow')
const historyRoute = require('./history')
const commentRoute = require('./comment')
const notifytRoute = require('./notify')
const authMiddleware = require('../middleware/auth')
const adminUserRoute = require("./admin/user")
const adminComicRoute = require("./admin/comic")
const adminChapterRoute = require("./admin/chapter")

const role = require('../config/role')
function route(app) {

    // user route
    app.use('/api', siteRoute)
    app.use('/api/comics', comicRoute)
    app.use('/api/categories', categoryRoute)
    app.use('/api/chapters', chapterRoute)
    app.use('/api/rates', rateRoute)
    app.use('/api/follows', followRoute)
    app.use('/api/histories', historyRoute)
    app.use('/api/comments', commentRoute)
    app.use('/api/notifications', notifytRoute)
    app.use('/api/users', userRoute)

    // admin route
    app.use('/api/admin', authMiddleware.checkUserToken, authMiddleware.authRole([role.ADMIN]))
    app.use('/api/admin/users', adminUserRoute)
    app.use('/api/admin/comics', adminComicRoute)
    app.use('/api/admin/chapters', adminChapterRoute)
}

module.exports = route