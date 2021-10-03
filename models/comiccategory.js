'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComicCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ComicCategory.init({
    comic_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ComicCategory',
    tableName: 'comic_categories'
  });
  return ComicCategory;
};