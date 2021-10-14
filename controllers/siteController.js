const { getStreamFile } = require("../util/s3")
class SiteController {
    index(req, res) {
        res.send('welcome')
    }

    async getImage(req, res) {
        let key = req.params.key

        if (!key) return res.json({ err: "not found" })
        let streamFile = getStreamFile(key)

        return streamFile.pipe(res)
    }
}
const siteController = new SiteController
module.exports = siteController