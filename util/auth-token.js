const jwt = require("jsonwebtoken");
const generateToken = (user, secret, expiresIn) => {
    let payload = {
        user_uuid: user.dataValues.user_uuid,
        user_role: user.dataValues.user_role
    };

    let token = jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    });

    return token
}

const generateRefreshToken = (user, secret, expiresIn) => {
    let payload = {
        user_uuid: user.dataValues.user_uuid
    }

    let token = jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    });

    return token
}


module.exports = { generateToken, generateRefreshToken }