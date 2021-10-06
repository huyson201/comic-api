'use strict';
const { getCategories } = require('../util')
const { getComics } = require('../util')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let comics = getComics(__dirname + '/../data/comics.json')
    let data = []

    for (let item of comics) {
      let listChapters = item.chapters
      let listData = listChapters.map((el, index) => {
        return {
          comic_id: item.id,
          chapter_name: `chapter ${index}`,
          chapter_imgs: el.join(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      data.push(...listData)
    }
    await queryInterface.bulkInsert('chapters', data, {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('chapters', null, {});

  }
};
