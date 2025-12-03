"use strict";
const { Model } = require("sequelize"); // Import only the Model class from Sequelize. Every Sequelize model extends this base Model class.

// Allow Sequelize to dynamically load all models in 'models' folder.
const Post = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: "userId", // FK always goes on the many side of the relationship
        as: "author",
        onDelete: "CASCADE", // deletes post if user is deleted
      });
    }
  }
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
        allowNull: true,
      },
      media: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      readBy: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
        allowNull: false,
      },
    },
    {
      sequelize, // db connection instance
      modelName: "Post",
      tableName: "Posts1",
      timestamps: true, // automatically adds createdAt & updatedAt fields
    }
  );

  return Post;
};

// Allow models/index.js to import and initialize
module.exports = Post;
