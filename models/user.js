'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    // user logout
    async logout() {
      this.setDataValue("remember_token", "")
      await this.save()
    }

    async changePassword(newPassword) {
      this.user_password = newPassword
      await this.save()
    }
    static associate({ Comic }) {
      // define association here
      this.belongsToMany(Comic, {
        through: "follows",
        as: 'comics_follow',
        foreignKey: 'user_uuid',
        otherKey: 'comic_id'
      })
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
        isEmail: { message: "email invalid" },
        notEmpty: { message: "email is empty" },
        notNull: { message: "email is null" }
      }
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 6,
        notNull: { message: "email is null" },
        notEmpty: { message: "email is empty" }
      },
      set(value) {
        let hash = bcrypt.hashSync(value, 10)
        this.setDataValue('user_password', hash)
      }
    },
    user_image: {
      type: DataTypes.TEXT
    },
    user_role: {
      type: DataTypes.STRING,
      defaultValue: "user"
    },
    remember_token: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};
