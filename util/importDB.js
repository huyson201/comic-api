const { Comic, Chapter, Category, ComicCategory, sequelize } = require("../models")
const fs = require('fs')
const filePath = __dirname + `/../data/comics-bigdata.json`

let data = fs.readFileSync(filePath, 'utf-8')
let comics = JSON.parse(data).comics

async function importDataComics() {
    try {

        // import data

        comics.forEach(async (element) => {

            try {
                importComics(element,)

                console.log("import " + element.name)

            } catch (error) {
                console.log(error.message)
            }

        });

        console.log("import completed")
    } catch (error) {
        console.log(error.message)
        return
    }



}



async function importDataChapters() {

    try {

        // import data

        comics.forEach(async (element) => {

            let chapters = element.chapters

            try {

                importChapter(chapters, element.id)

                console.log("import chapter of " + element.name)

            } catch (error) {
                console.log(error.message)
            }

        });

        console.log("import chapters completed ---------------------------------")
    } catch (error) {
        console.log(error.message)

    }



}


async function importDataCategory() {

    try {
        let categories = await Category.findAll({ attributes: ["category_name"] })
        categories = categories.map(element => {
            return element.get({ plain: true }).category_name
        });

        console.log(categories)
        // import data

        comics.forEach(async (element) => {

            let listCategories = element.categories

            try {

                importComicsCategory(categories, listCategories, element.id,)
                console.log("import " + element.name)

            } catch (error) {
                console.log(error.message)
            }

        });

        console.log("import category completed----------------------")
    } catch (error) {
        console.log(error.message)
        return
    }



}


const importComicsCategory = async (categories, listCategories, comic_id) => {

    listCategories.forEach(async (el) => {
        let index = categories.indexOf(el)
        await ComicCategory.create({
            comic_id: comic_id,
            category_id: index + 1,
        })

        console.log("import category" + index)
    })
    console.log(categories[0])




}

const importComics = async (comic) => {

    await Comic.create({
        comic_id: comic.id,
        comic_name: comic.name,
        comic_img: comic.imgUrl,
        comic_desc: comic.desc,
        comic_author: comic.author,
        comic_status: comic.status,
        comic_view: 0,
    })


}

const importChapter = async (chapters, comic_id) => {

    chapters.forEach(async (el, index) => {
        await Chapter.create({
            comic_id: comic_id,
            chapter_name: `chapter ${index}`,
            chapter_imgs: el.join(),
        })
    })

}

importDataComics()
importDataChapters()
importDataCategory()