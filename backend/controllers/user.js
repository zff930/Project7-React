const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

exports.signup = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return UserModel.create({
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
          id: user.id,
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

  UserModel.findOne({ where: { email } })
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
        { userId: foundUser.id, email: foundUser.email },
        process.env.JWT_SECRET || "RANDOM_TOKEN_SECRET", // provide a fallback if JWT_SECRET is missing in .env
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "User logged in successfully!",
        token: token,
        userId: foundUser.id,
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
