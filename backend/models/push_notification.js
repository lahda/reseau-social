'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PushNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
    }
  };
  PushNotification.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    endpoint: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    auth: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    p256dh: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: "push_notifications",
    modelName: "PushNotification",
  });
  return PushNotification;
};