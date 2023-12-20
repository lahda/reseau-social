'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Comment, Like }) {
      this.hasMany(Post, { foreignKey: 'userId', as: 'posts' })
      this.hasMany(Comment, { foreignKey: 'userId', as: 'comments' })
      this.hasMany(Like, { foreignKey: 'userId', as: 'likes' })
    }

    toJSON(){
      return { ...this.get(), id: undefined, password: undefined }
    }
  };
  User.init({
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
      type: DataTypes.STRING,
      defaultValue: ''
    },
    couverture: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: ''
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
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    connectedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
  }, {
    sequelize,
    tableName : 'users',
    modelName: 'User',
  });
  return User;
};