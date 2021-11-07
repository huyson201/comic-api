require('dotenv').config()
module.exports = {
    user: "coronaviruss.covid2021@gmail.com",
    password: 'coronaviruss',
    clientId: '429413223475-lu647nk94olusa10kiv1ps3inrdm6u0k.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: process.env.GOOGLE_REFREST_TOKEN,
    redirectUrl: 'https://developers.google.com/oauthplayground'
}