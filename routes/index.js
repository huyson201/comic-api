const siteRoute = require('./site')
const categoryRoute = require('./category')
const comicRoute = require('./comics')
const userRoute = require('./user')
const chapterRoute = require('./chapter')
function route(app) {

    app.use('/api', siteRoute)
    app.use('/api/comics', comicRoute)
    app.use('/api/categories', categoryRoute)
    app.use('/api/users', userRoute)
    app.use('/api/chapters', chapterRoute)
}

module.exports = route