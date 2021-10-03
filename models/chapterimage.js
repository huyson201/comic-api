'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChapterImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChapterImage.init({
    chapter_id: {
      type: DataTypes.INTEGER
    },
    image_link: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ChapterImage',
  });
  return ChapterImage;
};