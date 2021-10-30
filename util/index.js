const fs = require('fs')
const googleDrive = require('./google-drive');
const { generateToken, generateRefreshToken } = require('./auth-token')

function getComics(url) {
    let dataJson
    try {
        let data = fs.readFileSync(url, 'utf-8')
        dataJson = JSON.parse(data)

        return dataJson.comics

    }
    catch (err) {
        console.log(err)
    }

    return dataJson
}

function getCategories(url) {
    let dataJson
    try {
        let data = fs.readFileSync(url, 'utf-8')
        dataJson = JSON.parse(data)

        return dataJson.categories

    }
    catch (err) {
        console.log(err)
    }

    return dataJson
}

function searchParams(url) {
    let search = new URL(url).searchParams
    return {
        get(param) {
            return search.get(param)
        }
    }
}

function uploadFile(file) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await googleDrive.uploadFileDrive(file)
            let fileId = result.data.id
            let link = await googleDrive.generatePublicUrl(fileId)
            let data = link.data
            imgUrl = data.thumbnailLink.replace(/=s(\w)*$/i, '') + `?id=${link.data.id}`
            resolve(imgUrl)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { getComics, getCategories, searchParams, uploadFile, generateToken, generateRefreshToken, googleDrive }