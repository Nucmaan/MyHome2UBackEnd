require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");


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
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
  });
});

module.exports = app;
