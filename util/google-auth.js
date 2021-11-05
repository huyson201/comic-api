const { google } = require('googleapis')
const config = require('../config/google.js')
const oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUrl)

const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/analytics',
    'https://mail.google.com'
];

oauth2Client.setCredentials({ refresh_token: config.refreshToken })

oauth2Client.generateCodeVerifierAsync().then(data => console.log(data))





module.exports = oauth2Client