'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comments', {
      comment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      comment_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      user_uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      parent_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      comic_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('comments');
  }
};