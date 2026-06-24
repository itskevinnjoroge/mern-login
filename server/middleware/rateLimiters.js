// middleware/rateLimiters.js
const rateLimit = require("express-rate-limit");

/**
 * Applied to POST /api/auth/login.
 * 10 attempts per IP per 15 minutes.
 * A legitimate user who misremembers their password won't hit this;
 * an automated brute-force will be stopped within seconds.
 */
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true, // sends RateLimit-* headers so clients can adapt
  legacyHeaders: false,
});

/**
 * Applied to POST /api/auth/register.
 * 5 accounts per IP per hour — generous enough for any real user,
 * tight enough to slow down account-farming bots.
 */
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message:
      "Too many accounts created from this IP. Please try again in an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
