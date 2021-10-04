const siteRoute = require('./site')
const categoryRoute = require('./category')
function route(app) {

    app.use('/api', siteRoute)
    app.use('/api/categories', categoryRoute)
}

module.exports = route