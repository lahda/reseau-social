'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      firstname: {
        allowNull: false,
        type: DataTypes.STRING
      },
      lastname: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notNull: true,
          is: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          // is: /^(?=.*\d).{4,8}$/
        }
      },
      avatar: {
        allowNull: false,
        type: DataTypes.STRING
      },
      couverture: {
        allowNull: false,
        type: DataTypes.STRING
      },
      bio: {
        allowNull: true,
        type: DataTypes.STRING
      },
      isAdmin: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      isConnected: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      connectedAt: {
        allowNull: false,
        type: DataTypes.DATE
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
    await queryInterface.dropTable('users');
  }
};