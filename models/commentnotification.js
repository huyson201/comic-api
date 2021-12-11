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
    static associate({ User, Comment }) {
      // define association here
      this.belongsTo(User, { as: 'actor_info', foreignKey: 'actor_id', targetKey: 'user_uuid' })
      this.belongsTo(User, { as: 'notifier_info', foreignKey: 'notifier_id', targetKey: 'user_uuid' })
      this.belongsTo(Comment, { as: 'comment_info', foreignKey: 'comment_id' })
    }

    toJSON() {
      return { ...this.get() }
    }
  };
  CommentNotification.init({
    notifier_id: DataTypes.STRING,
    actor_id: DataTypes.STRING,
    comment_id: DataTypes.INTEGER,
    notification_message: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'new'
    }
  }, {
    sequelize,
    modelName: 'CommentNotification',
    tableName: 'comment_notify'
  });
  return CommentNotification;
};