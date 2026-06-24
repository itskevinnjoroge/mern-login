// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },

    // ── Email verification ──────────────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, select: false },
    verifyTokenExpires: { type: Date, select: false },

    // ── Refresh token ───────────────────────────────────────────────────────
    // We store a hashed version so a DB leak doesn't expose live tokens.
    refreshTokenHash: { type: String, select: false },

    // ── Password reset ──────────────────────────────────────────────────────
    resetToken: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
