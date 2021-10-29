const fs = require('fs')

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


module.exports = { getComics, getCategories, searchParams }