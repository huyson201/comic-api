'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Chapter.init({
    chapter_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    comic_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chapter_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chapter_imgs: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Chapter',
    tableName: 'chapters'
  });
  return Chapter;
};