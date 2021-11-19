const googleAuth = require('./google-auth')
const { google } = require('googleapis')
const fs = require('fs')

const drive = google.drive({
    version: 'v3',
    auth: googleAuth,
})


//* upload file to drive
const uploadFileDrive = (file) => {
    let filePath = __dirname + "/../uploads/" + file.filename
    let stream = fs.createReadStream(filePath)
    return new Promise(async (resolve, reject) => {
        try {
            let res = await drive.files.create({
                requestBody: {
                    name: file.filename,
                    mimeType: 'image/*,audio/*,video/*',
                },
                media: {
                    mimeType: file.mimetype,
                    body: stream
                }
            })
            fs.unlinkSync(filePath)
            resolve(res)
            // console.log(res,"create");
        }
        catch (error) {
            fs.unlinkSync(filePath)
            reject(error)
        }
    })
}

//* update file Drive
const updateFileDrive = (fileId, file) => {
    let filePath = __dirname + "/../uploads/" + file.filename
    let stream = fs.createReadStream(filePath)

    return new Promise(async (resolve, reject) => {
        try {
            let res = await drive.files.update({
                fileId: fileId,
                requestBody: {
                    name: file.filename,
                    mimeType: 'image/*,audio/*,video/*'
                },
                media: {
                    mimeType: file.mimetype,
                    body: stream
                }
            })

            fs.unlinkSync(filePath)
            resolve(res)
            // console.log(res,"005465464561");
        }
        catch (error) {
            fs.unlinkSync(filePath)
            reject(error)
        }
    })
}

// updateFileDrive('1a5Flw6eLUjyjdVhLIwC9BhCwQ_txP_mA', null)

//* delete a file drive
const deleteFileDrive = (fileId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await drive.files.delete({
                fileId: fileId
            })
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

// deleteFileDrive('1FJNjqMmrmZbHudRBzA-nKAtlLPGqL89l')


//* create public url
const generatePublicUrl = (fileId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: "anyone"
                }
            })

            let res = await drive.files.get({
                fileId: fileId,
                fields: 'webViewLink, webContentLink, thumbnailLink, id',
            })

            resolve(res)
        }
        catch (error) {
            reject(error)
        }
    })
}

// generatePublicUrl('1a5Flw6eLUjyjdVhLIwC9BhCwQ_txP_mA')

const googleDrive = { uploadFileDrive, updateFileDrive, deleteFileDrive, generatePublicUrl }

module.exports = googleDrive