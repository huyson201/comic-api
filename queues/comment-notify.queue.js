require('dotenv').config()
const Bull = require('bull')
const commentNotifyProcess = require('./processes/comment-notify.process')

const commentNotifyQueue = new Bull('commentNotify', {
    redis: process.env.REDIS_URL,
    limiter: {
        max: 1000,
        duration: 5000
    }
})

commentNotifyQueue.process(commentNotifyProcess)

const sendCommentNotify = (data) => {
    commentNotifyQueue.add(data, {
        removeOnComplete: true,
        removeOnFail: true
    })
}

module.exports = sendCommentNotify

