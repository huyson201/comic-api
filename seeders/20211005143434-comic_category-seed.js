'use strict';
const { getCategories } = require('../util')
const { getComics } = require('../util')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let comics = getComics(__dirname + '/../data/comics.json')
    let categories = getCategories(__dirname + '/../data/categories.json')
    let data = []

    for (let item of comics) {
      let listCate = item.categories
      let listData = listCate.map(el => {
        let index = categories.indexOf(el)
        return {
          comic_id: item.id,
          category_id: index + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      data.push(...listData)
    }

    await queryInterface.bulkInsert('comic_categories', data, {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('comic_categories', null, {});

  }
};
