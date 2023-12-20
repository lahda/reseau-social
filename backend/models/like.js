'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
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
  Like.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'likes',
    modelName: 'Like',
  });

  return Like;
};