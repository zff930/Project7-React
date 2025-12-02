const express = require("express"); // express - a function used to create an Express application that handles HTTP requests.
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routers/user");
const postRoutes = require("./routers/post");
const protectedRoutes = require("./routers/protected");
const { sequelize } = require("./models"); // import Sequelize instance to connect db and sync models with db

const app = express(); // Express app instance to define middleware, routes, and start the server.

// ===============================
// Middleware
// ===============================
app.use(cors); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies -> req.body
app.use("/api/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static uploads

// ===============================
// Routes
// ===============================
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/protected", protectedRoutes);

// ===============================
// Database Sync b.f. Server Start
// ===============================
sequelize
  .sync({ alter: true }) // Automatically updates tables to match model definitions (without dropping data).
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("DB sync error:", err));

module.exports = app;
