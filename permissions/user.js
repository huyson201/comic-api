const role = require("../config/role")
const canGetDetail = (user, userId) => {
    return (
        user.user_role === role.ADMIN ||
        user.user_uuid === userId
    )
}

const canUpdate = (user, userId) => {
    return (
        user.user_role === role.ADMIN ||
        user.user_uuid === userId
    )
}

const updateScope = (role, user, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (role.ADMIN && user.user_role !== role.ADMIN) {
                await user.update(data)
            }
            else {
                await user.update({ ...data, user_role: undefined, user_email: undefined, user_uuid: undefined })
            }
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
}

const canGetFollows = (user, userId) => {
    return (
        user.user_uuid === userId
    )
}
module.exports = { canGetDetail, canUpdate, updateScope, canGetFollows }