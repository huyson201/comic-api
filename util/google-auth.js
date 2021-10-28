const { google } = require('googleapis')
const config = require('../config/google.js')
const oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUrl)
oauth2Client.setCredentials({ refresh_token: config.refreshToken })

module.exports = oauth2Client