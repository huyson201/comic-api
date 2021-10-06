'use strict';
const { getComics } = require('../util')


module.exports = {

  up: async (queryInterface, Sequelize) => {
    let comics = getComics(__dirname + '/../data/comics.json')
    let arrComics = comics.map(el => {
      return {
        comic_id: el.id,
        comic_name: el.name,
        comic_img: el.imgUrl,
        comic_desc: el.desc,
        comic_author: el.author,
        comic_status: el.status,
        comic_view: 0,
        createdAt: new Date(),
        updatedAt: new Date()

      }
    })
    await queryInterface.bulkInsert('comics', arrComics, {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('comics', null, {});

  }
};

