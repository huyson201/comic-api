'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comics', {
      comic_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      comic_name: {
        type: Sequelize.STRING
      },
      comic_desc: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      comic_author: {
        type: Sequelize.STRING,
        allowNull: true
      },
      comic_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      comic_view: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comics');
  }
};