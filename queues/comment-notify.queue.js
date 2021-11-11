require('dotenv').config()
const Bull = require('bull')
const commentNotifyProcess = require('./processes/comment-notify.process')

const commentNotifyQueue = new Bull('commentNotify', process.env.REDIS_URL)

commentNotifyQueue.process(commentNotifyProcess)

commentNotifyQueue.on("error", err => {
    if (!err) {
        console.log('connect redis success')
    }
    console.log(err)
})

const sendCommentNotify = (data) => {
    commentNotifyQueue.add(data, {
        removeOnComplete: true,
        removeOnFail: true
    })
}
module.exports = sendCommentNotify

