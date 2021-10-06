const siteRoute = require('./site')
const categoryRoute = require('./category')
const comicRoute = require('./comics')
const userRoute = require('./user')
function route(app) {

    app.use('/api', siteRoute)
    app.use('/api/comics', comicRoute)
    app.use('/api/categories', categoryRoute)
    app.use('/api/users', userRoute)
}

module.exports = route