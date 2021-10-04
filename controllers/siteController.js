class SiteController {
    index(req, res) {
        res.send('welcome')
    }
}
const siteController = new SiteController
module.exports = siteController