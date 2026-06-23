// server.js
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // allow the browser to send/receive the httpOnly cookie
  }),
);
app.use(express.json());
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.use((req, res) => res.status(404).json({ message: "Route not found." }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB connected");
    app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌  DB connection failed:", err.message);
    process.exit(1);
  });
