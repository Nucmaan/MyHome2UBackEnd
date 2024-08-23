require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const app = express();

// List of allowed origins
const allowedOrigins = [
  'https://statefrontend.onrender.com',
  'http://localhost:3000',
  'https://myhome2u.vercel.app',
  'http://192.168.0.29:5000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowed origins list
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allows cookies to be sent and received
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow specific HTTP methods
  })
);



// Middleware to parse JSON and URL-encoded data
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Define your routes here (e.g., app.use('/api', apiRouter))

app.get("/", (req, res) => {
  res.send("WELCOME MyHome2U API Home Page! ");
});

const UserRouter = require("./Router/UserRouter.js");
const PropertyRouter = require("./Router/PropertyListing.js");
const BookingRouter = require("./Router/Booking.js");
const ContractRouter = require("./Router/Contract.js");
const BillRouter = require("./Router/Bills.js");
const SocialMediaRouter = require("./Router/SocialMedia.js");
const BlogRouter = require("./Router/Blog.js");
const SectionRouter = require("./Router/AboutUsRouter.js");
const HeroImageRouter = require("./Router/HeroImage.js");

app.use("/api/MyHome2U/user", UserRouter);
app.use("/api/MyHome2U/property", PropertyRouter);
app.use("/api/MyHome2U/Booking", BookingRouter);
app.use("/api/MyHome2U/contract", ContractRouter);
app.use("/api/MyHome2U/bills", BillRouter);
app.use("/api/MyHome2U/socialMedia", SocialMediaRouter);
app.use("/api/MyHome2U/Blog",BlogRouter);
app.use("/api/MyHome2U/AboutUs", SectionRouter);
app.use("/api/MyHome2U/HeroImage",HeroImageRouter);


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
