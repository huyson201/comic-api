require('dotenv').config()
const { getStreamFile } = require("../util/s3")
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const { sendMailResetPassword } = require('../util/mailer')
const googleDrive = require('../util/google-drive.js')
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

    async forgetPassword(req, res) {
        let { user_email } = req.body
        try {
            let user = await User.findOne({ where: { user_email } })
            if (!user) return res.status(400).send("Email not exist")

            user = user.get({ plain: true })
            // create reset password token
            let payload = { user_uuid: user.user_uuid, user_email: user.user_email, user_role: user.user_role }

            let token = jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET, { expiresIn: '15m' })

            // send link rest password to user's email
            let link = process.env.RESET_PASSWORD_HOST || 'localhost:3000' + '/reset-password/' + token

            let info = await sendMailResetPassword(link, user_email)

            return res.status(200).json({ code: 200, message: info.response, data: true })

        } catch (error) {

            return res.status(400).send(error.message)
        }
    }

    async forgetPasswordConfirm(req, res) {
        let { reset_password_token } = req.body
        if (!reset_password_token) return res.status(200).json({ code: 400, name: "", message: "Reset password token not found" })

        try {
            let decoded = jwt.verify(reset_password_token, process.env.RESET_PASSWORD_TOKEN_SECRET)
            if (!decoded) return res.json({ message: "Something error" })
            return res.status(200).json({ code: 200, name: "", message: "Confirm success", data: true })
        }
        catch (error) {

            return res.status(400).send(error.message)
        }


    }

    async resetPassword(req, res) {
        let { new_password, confirm_password } = req.body
        if (new_password !== confirm_password) return res.status(400).send("Confirm password invalid")

        try {
            let user = req.user
            if (!user) return res.status(400).send("User not found")

            user.user_password = new_password
            await user.save()

            return res.status(200).json({ code: 200, name: "", message: "Reset password successfully!", data: true })

        } catch (error) {
            return res.status(400).send(error.message)
        }
    }

    async uploadDrive(req, res) {

        let file = req.file
        if (!file) return res.send(400).send('file not found')

        try {
            let result = await googleDrive.uploadFileDrive(file)
            let imgId = result.data.id
            let link = await googleDrive.generatePublicUrl(imgId)
            return res.json({ data: link.data })
        }
        catch (error) {
            return res.status(400).send(error.message)
        }

    }


}
const siteController = new SiteController
module.exports = siteController