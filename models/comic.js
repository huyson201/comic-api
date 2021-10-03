'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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