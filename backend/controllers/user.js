const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.signup = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      res.status(201).json({
        message: "User created successfully!",
        user: {
          id: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      console.error("Signup error:", err);
      res.status(500).json({
        error: "Error creating user!",
      });
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let foundUser;

  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: "User not found!",
        });
      }
      foundUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isValid) => {
      if (!isValid) {
        return res.status(401).json({
          error: "Invalid password!",
        });
      }

      const token = jwt.sign(
        { userId: foundUser.userId, email: foundUser.email },
        process.env.JWT_SECRET || "RANDOM_TOKEN_SECRET", // provide a fallback if JWT_SECRET is missing in .env
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "User logged in successfully!",
        token: token,
        userId: foundUser.userId,
        email: foundUser.email,
      });
    })
    .catch((err) => {
      console.error("Login error:", err);
      res.status(500).json({
        error: "Internal Server Error!",
      });
    });
};
