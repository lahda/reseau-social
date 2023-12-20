'use strict';
const { Model } = require('sequelize');
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Comment }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
      this.hasMany(Comment, { foreignKey: 'postId', as: 'comments' })
    }

    toJSON() {
      return { ...this.get(), userId: undefined }
    }
  };

  Post.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING(500)
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING(10000)
    },
    likes: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    tableName: 'posts',
    modelName: 'Post',
  });
  return Post;
};
