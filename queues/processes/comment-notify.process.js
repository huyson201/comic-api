const { getUserConnected } = require('../../user-connect')
const { CommentNotification } = require('../../models')
const { getIo } = require('../../socket-io')
const commentNotifyProcess = async (job, jobDone) => {
    let notify = await CommentNotification.create(job.data)

    const actorConnected = getUserConnected(job.data.actor_id)

    console.log(job.data)
    console.log(actorConnected)

    if (actorConnected) {
        const io = getIo()
        io.to(actorConnected).emit('comment-notify', notify)
        console.log('sended')
    }

    jobDone();
}

module.exports = commentNotifyProcess