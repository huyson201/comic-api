'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      return { ...this.get(), user_password: undefined, remember_token: undefined }
    }
  };
  User.init({
    user_uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING
    },
    user_email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: { msg: "email invalid" },
        notEmpty: { msg: "email is empty" },
        notNull: { msg: "email is null" }
      }
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 6,
        notNull: { msg: "email is null" },
        notEmpty: { msg: "email is empty" }
      }
    },
    user_image: {
      type: DataTypes.STRING
    },
    user_role: {
      type: DataTypes.STRING,
      defaultValue: "user"
    },
    remember_token: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};
