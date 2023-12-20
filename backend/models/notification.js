"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userSender', as: 'sender' })
    }
  }
  Notification.init(
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userSender: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      postId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      viewed: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      tableName: "notifications",
      modelName: "Notification",
    }
  );
  return Notification;
};
