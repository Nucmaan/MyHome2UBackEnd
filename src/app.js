require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const  rateLimit  = require("express-rate-limit");


const UserRouter = require("./Router/UserRouter.js");
const cors = require("cors");
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow all origins
    credentials: true,
  })
);

// Rate limiter middleware

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

app.use(limiter);

// Middleware to parse JSON and URL-encoded data
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Define your routes here (e.g., app.use('/api', apiRouter))

app.get("/", (req, res) => {
  res.send("WELCOME MY HOME TO YOU API!");
});

app.use("/api/MyHome2U/user", UserRouter);

// client error handling

app.use((req, res, next) => {
  next(createError(404, "Page Route Not Found"));
});

// server error handling
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    error: {
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    },
  });
});

module.exports = app;
