const express = require("express");
const { sequelize } = require("./models");
const userRoutes = require("./routers/user");
const postRoutes = require("./routers/post");

const app = express();
 
// Enable CORS
const enableCors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};

app.use(enableCors);
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);

// Auto-sync database tables before starting server
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("DB sync error:", err));
 
module.exports = app;
