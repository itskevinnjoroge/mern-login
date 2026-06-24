// controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Converts "7d" / "12h" / "30m" style strings into milliseconds for cookie maxAge.
// Falls back to 7 days if it can't parse the value.
const expiresInMs = (value) => {
  const match = /^(\d+)([smhd])$/.exec(value || "7d");
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const num = Number(match[1]);
  const unit = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }[match[2]];
  return num * unit;
};

const sendAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: expiresInMs(process.env.JWT_EXPIRES_IN),
    path: "/",
  });
};

/**
 * @route  POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    sendAuthCookie(res, token);

    res.status(201).json({
      message: "Account created successfully.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

/**
 * @route  POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);
    sendAuthCookie(res, token);

    res.status(200).json({
      message: "Login successful.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

/**
 * @route  POST /api/auth/logout
 * @access Public
 */
exports.logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully." });
};

/**
 * @route  GET /api/auth/me
 * @access Private — used by the frontend on load to check session state
 */
exports.getMe = async (req, res) => {
  // req.user is attached by the `protect` middleware
  res.status(200).json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};
