const User = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate request
    if (!(name && email && password && phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Use another email address.",
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(
      password,
      process.env.HashPassword
    );

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "This Email is not Registered.",
      });
    }

    // Check if password is correct
    const isMatch = await bcryptjs.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Remove password from user object
    userExists.password = undefined;

    res.cookie("token", token);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userExists,
      token: token, // Add token to response
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out" });
};

module.exports = {
  Register,
  login,
  logout,
};
