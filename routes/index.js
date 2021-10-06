const siteRoute = require('./site')
const categoryRoute = require('./category')
const comicsRoute = require('./comics')
function route(app) {

    app.use('/api', siteRoute)
    app.use('/api/comics', comicsRoute)
    app.use('/api/categories', categoryRoute)
}

module.exports = route