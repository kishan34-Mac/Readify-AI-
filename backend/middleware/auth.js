const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getTokenFromHeader = (authHeader = "") => {
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
};

const loadUserFromToken = async (token) => {
  if (!token) {
    return null;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing. Add it to backend/.env before starting the server.");
  }

  const decoded = jwt.verify(token, jwtSecret);
  const user = await User.findById(decoded.userId).select("_id name email createdAt");
  return user || null;
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization || "");
    req.user = await loadUserFromToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }
};

const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization || "");
    const user = await loadUserFromToken(token);

    if (!user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }
};

module.exports = { optionalAuth, requireAuth };
