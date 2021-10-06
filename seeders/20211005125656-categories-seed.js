'use strict';
const { getCategories } = require('../util')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let categories = getCategories(__dirname + '/../data/categories.json')

    let arrObjCategory = categories.map((el) => {
      return {
        category_name: el,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    await queryInterface.bulkInsert('categories', arrObjCategory, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Category', null, {});
  }
};



