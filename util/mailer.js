require('dotenv').config()
const nodemailer = require('nodemailer')
const mailerConfig = require('../config/mailer')


const sendMailResetPassword = async (link, toEmail) => {


    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'LOGIN',
            user: mailerConfig.user,
            pass: mailerConfig.password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }

    })
    let message = createMailRestPassword(link)
    let option = createMailOption('coronaviruss.covid2021@gmail.com', toEmail, 'Reset password Love Comics', '', message)




    return new Promise((resolve, reject) => {
        transporter.sendMail(option, (err, info) => {
            if (err) {
                console.log(err)
                reject(err)
                return
            }
            resolve(info)
        })
    })
}

const createMailOption = (fromMail, toMail, subject, textContent, htmlContent) => {

    return {
        from: `LoveComic <${fromMail}>`,
        to: toMail,
        subject: subject,
        text: textContent,
        html: htmlContent
    }
}

const createMailRestPassword = (link) => {
    let message = `<p>Chào bạn,</p>
        Bạn vừa thực hiện yêu cầu phục hồi mật khẩu, để thay đổi mật khẩu, bạn vui lòng click vào đường link bên dưới:<br>
        <a href='${link}'>Click here to redirect to reset password page</a>
        <br>
        <p>Lưu ý: Đường dẫn trên chỉ tồn tại trong vòng 15 phút.</p>
        <p>Đây là email tự động, vui lòng không phản hồi lại trên email này.</p>
        <p>Trân trọng,<br> <b>Love Comic</b></p> `

    return message
}

module.exports = { sendMailResetPassword, createMailOption, createMailRestPassword }



