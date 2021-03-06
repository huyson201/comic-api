'use strict';
const {
  Model
} = require('sequelize');
const category = require('./category');
module.exports = (sequelize, DataTypes) => {
  class Comic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Category, Chapter, Comment }) {
      this.belongsToMany(Category, {
        through: "comic_categories",
        as: "categories",
        foreignKey: "comic_id",
        otherKey: "category_id",

      })

      this.hasMany(Chapter, { foreignKey: "comic_id", as: "chapters" })

      this.hasMany(Comment, { as: 'comments', foreignKey: "comic_id" })

    }
    toJSON() {
      return { ...this.get() }
    }
  };
  Comic.init({
    comic_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    comic_name: {
      type: DataTypes.STRING
    },
    comic_img: {
      type: DataTypes.STRING
    },
    comic_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comic_author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comic_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comic_view: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Comic',
    tableName: 'comics'
  });
  return Comic;
};