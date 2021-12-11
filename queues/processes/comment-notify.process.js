const { getUserConnected } = require('../../user-connect')
const { CommentNotification } = require('../../models')
const { getIo } = require('../../socket-io')
const commentNotifyProcess = async (job, jobDone) => {
    let notify = await CommentNotification.create(job.data)
    let notifyData = notify.get({ plain: true })
    notifyData.notifier_info = notify.getNotifier_info()
    notifyData.comment_info = notify.getComment_info()
    const actorConnected = await getUserConnected(job.data.actor_id)

    console.log(actorConnected)

    if (actorConnected) {
        const io = getIo()
        io.to(actorConnected).emit('comment-notify', notifyData)
        console.log('sended')
    }

    jobDone();
}

module.exports = commentNotifyProcess