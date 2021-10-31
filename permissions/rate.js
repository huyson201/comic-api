const canUpdate = (user, userId) => {
    return (
        user.user_uuid === userId
    )
}

module.exports = { canUpdate }