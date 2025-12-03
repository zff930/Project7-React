const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Generate JWT helper
const generateToken = (user) => {
  // jwt.sign(payload, secret key, options)
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "RANDOM_TOKEN_SECRET",
    { expiresIn: "24h" }
  );
};

exports.signup = async (req, res, next) => {
  try {
    // Destructure the user input from req.body
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use 'User' model to save the data to db
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);
    // for localStorage
    res.status(201).json({
      message: "User created successfully!",
      token: token,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating user!" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User not found!" });
    }

    // Prevent deleted users from logging in
    if (user.isDeleted) {
      return res.status(403).json({ error: "This account has been deleted." });
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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ensure user can only delete their own account
    if (req.auth.userId.toString() !== id.toString()) {
      return res.status(403).json({ error: "Forbidden: Unauthorized request" });
    }

    // user is a model instance in memory
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Soft delete by setting isDeleted = true
    // Only update the object in memory, not the database.
    user.isDeleted = true;
    // To persist changes
    await user.save();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
