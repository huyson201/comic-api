'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Rate.init({
    rate_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    rate_star: {
      type: DataTypes.INTEGER
    },
    user_uuid: {
      type: DataTypes.STRING
    },
    comic_id: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Rate',
    tableName: 'rates'
  });
  return Rate;
};