"use strict"; // Enable strict mode in JS for safer coding practices.

const fs = require("fs"); // File system module - r/w files and directories
const path = require("path");
const Sequelize = require("sequelize"); // ORM library - interact db
const process = require("process"); // Give access to process.env and other process info

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env]; // Load db config for current environment from config.json
const db = {};

// Use env variables for DB credentials if set, otherwise fallback to config.json
const database = process.env.DB_NAME || config.database;
const username = process.env.DB_USERNAME || config.username;
const password = process.env.DB_PASSWORD || config.password;
const host = process.env.DB_HOST || config.host;
const port = process.env.DB_PORT || config.port;

// Initialize Sequelize instance with clean dev/prod logging
let sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: "postgres",
  logging: env === "development" ? (msg) => console.log("[SQL]", msg) : false,
});

// Dynamically import all models in this folder
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Call associate() for all models if defined (for relationships)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export Sequelize instance and models
db.sequelize = sequelize; // database connection instance
db.Sequelize = Sequelize; // Sequelize library itself (sometimes needed for DataTypes or operators)

// Object db contains:
// sequelize → the Sequelize instance (the database connection)
// Sequelize → the Sequelize library itself
// Plus all your models dynamically loaded: db.User, db.Post, etc.
module.exports = db;
