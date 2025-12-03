const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // jwt.verify(token, secret) does two things: 1. Checks if the token is valid and not tampered with. 2. Decodes the payload inside the token.
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "RANDOM_TOKEN_SECRET"
    );
    // Destructuring
    const { userId, email } = decodedToken;
    req.auth = { userId, email };

    if (req.body && req.body.userId && req.body.userId != userId) {
      return res.status(403).json({ error: "Forbidden: Invalid user ID" });
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
