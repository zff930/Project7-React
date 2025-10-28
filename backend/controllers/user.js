const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Generate JWT helper
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "RANDOM_TOKEN_SECRET",
    { expiresIn: "24h" }
  );
};

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);
    res.status(201).json({
      message: "User created successfully!",
      token,
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      error: "Error creating user!",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: "User not found!",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Invalid password!",
      });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "User logged in successfully!",
      token: token,
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
};
