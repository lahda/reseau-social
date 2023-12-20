'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('privates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('privates');
  }
};