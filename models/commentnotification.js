'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJSON() {
      return { ...this.get() }
    }
  };
  CommentNotification.init({
    notifier_id: DataTypes.STRING,
    actor_id: DataTypes.STRING,
    comment_id: DataTypes.INTEGER,
    notification_message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CommentNotification',
    tableName: 'comment_notify'
  });
  return CommentNotification;
};