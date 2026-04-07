const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const sanitizeUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const createToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing. Add it to backend/.env before starting the server.");
  }

  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

router.post("/signup", async (req, res) => {
  try {
    const { name = "", email = "", password = "" } = req.body || {};

    if (name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters long." });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = createToken(user._id);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({ error: "Could not create the account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email = "", password = "" } = req.body || {};
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = createToken(user._id);
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Could not log in." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

module.exports = router;
