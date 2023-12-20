'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId1', as: 'user1' })
      this.belongsTo(User, { foreignKey: 'userId2', as: 'user2' })
    }
    toJSON(){
      return { ...this.get(), userId1: undefined, userId2: undefined}
    }
  };
  Room.init({
    userId1: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId2: {
      allowNull: false,
      type: DataTypes.INTEGER,
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
    tableName: 'rooms',
    modelName: 'Room',
  });
  return Room;
};