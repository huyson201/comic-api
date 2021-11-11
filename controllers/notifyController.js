const { CommentNotification } = require('../models')

class NotifyController {
    async update(req, res) {
        let data = req.body.notification
        try {
            let result = await CommentNotification.update(data, { where: { id: data.id } })
            return res.status(200).json({ data: result })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }
}
const controller = new NotifyController
module.exports = controller