const siteRoute = require('./site')
const categoryRoute = require('./category')
const comicRoute = require('./comics')
const userRoute = require('./user')
const chapterRoute = require('./chapter')
const rateRoute = require('./rate')
const followRoute = require('./follow')
const commentRoute = require('./comment')
const authMiddleware = require('../middleware/auth')
const { checkAdminRole } = require('../middleware/admin')
function route(app) {

    // user route
    app.use('/api', siteRoute)
    app.use('/api/comics', comicRoute)
    app.use('/api/categories', categoryRoute)
    app.use('/api/users', userRoute)
    app.use('/api/chapters', chapterRoute)
    app.use('/api/rates', rateRoute)
    app.use('/api/follows', followRoute)
    app.use('/api/comments', commentRoute)

    // admin route
    app.use('/api/admin', authMiddleware.checkUserToken, checkAdminRole)
    app.use('/api/admin/comics', comicRoute)
}

module.exports = route