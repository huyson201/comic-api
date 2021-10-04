'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      user_uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      user_name: {
        type: Sequelize.STRING
      },
      user_email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: { msg: "email invalid" },
          notEmpty: { msg: "email is empty" },
          notNull: { msg: "email is null" }
        }
      },
      user_password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          min: 6,
          notNull: { msg: "email is null" },
          notEmpty: { msg: "email is empty" }
        }
      },
      user_image: {
        type: Sequelize.STRING
      },
      user_role: {
        type: Sequelize.STRING,
        defaultValue: "user"
      },
      remember_token: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('users');
  }
};