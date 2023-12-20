'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('push_notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
    await queryInterface.dropTable('push_notifications');
  }
};