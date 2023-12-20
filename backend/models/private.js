'use strict';
const { Model } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class Private extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Room }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
      this.belongsTo(Room, { foreignKey: 'roomId', as: 'room' })
    }
  };
  Private.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    roomId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    message: {
      allowNull: false,
      type: DataTypes.STRING
    },
    viewed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'privates',
    modelName: 'Private',
  });
  return Private;
};