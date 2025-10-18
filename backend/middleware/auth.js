const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "RANDOM_TOKEN_SECRET"
    );
    const { userId, email } = decodedToken;
    req.auth = { userId, email };

    if (req.body && req.body.userId && req.body.userId != userId) {
      return res.status(403).json({ error: "Forbidden: Invalid user ID" });
    }

    next();
  } catch(err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({
      error: "Unauthorized: Invalid token",
    });
  }
};

module.exports = auth;
