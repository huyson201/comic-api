const jwt = require("jsonwebtoken");
const generateToken = (user, secret, expiresIn) => {
    let payload = {
        ...user.dataValues,
        user_password: undefined,
        remember_token: undefined,
        createdAt: undefined,
        updatedAt: undefined
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