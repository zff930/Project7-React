"use strict";
const { Model } = require("sequelize");

const Post = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   Post.belongsTo(models.User, {
    //     foreignKey: "userId",
    //     as: "author",
    //     onDelete: "CASCADE", // deletes post if user is deleted
    //   });

      // Post.hasMany(models.Comment, {
      //   foreignKey: "postId",
      //   as: "comments",
      //   onDelete: "CASCADE", // deletes post if user is deleted
      // });

      // Post.hasMany(models.Like, {
      //   foreignKey: "postId",
      //   as: "likes",
      //   onDelete: "CASCADE", // deletes post if user is deleted
      // });
    }
  // }
  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      commentsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "Posts1",
      timestamps: true,
    }
  );

  return Post;
};

module.exports = Post;
