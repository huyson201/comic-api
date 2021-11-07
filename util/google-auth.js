const { google } = require('googleapis')
const KEY_PATH = __dirname + `/../config/gmail-api-329906-c008c5e3961f.json`

const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/analytics',
    'https://mail.google.com'
];

const googleAuth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: scopes
})


module.exports = googleAuth


// const oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUrl)

// const scopes = [
//     'https://www.googleapis.com/auth/drive',
//     'https://www.googleapis.com/auth/analytics',
//     'https://mail.google.com'
// ];

// oauth2Client.setCredentials({ refresh_token: config.refreshToken })
// module.exports = oauth2Client