"use strict";
const { Model } = require("sequelize");

const User = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
        onDelete: "CASCADE", // deletes posts if user is deleted
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [2, 30] },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [2, 30] },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [6, 100] },
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users1",
      timestamps: true,
    }
  );

  return User;
};

module.exports = User;
