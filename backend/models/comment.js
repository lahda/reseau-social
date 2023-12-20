'use strict';
const { Model } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Post }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
      this.belongsTo(Post, { foreignKey: 'postId', as: 'post' })
    }

    toJSON(){
      return { ...this.get(), userId: undefined}
    }
  };
  Comment.init({
    content: {
      allowNull: false,
      type: DataTypes.STRING
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
    tableName: 'comments',
    modelName: 'Comment',
  });
  return Comment;
};