const User = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ErrorHandler = require("../Utils/error.js");

const frontendUrl = process.env.FRONTEND_URL;

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

    // Parse salt rounds from environment variable
    const saltRounds = parseInt(process.env.HashPassword, 10);
    if (isNaN(saltRounds)) {
      throw new Error("Invalid salt rounds value in environment variable");
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!(email && password)) {
      return next(ErrorHandler(400, "Please provide all required fields"));
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return next(ErrorHandler(400, "This Email is not Registered."));
    }

    // Check if password is correct
    const isMatch = await bcryptjs.compare(password, userExists.password);
    if (!isMatch) {
      return next(ErrorHandler(400, "Incorrect Password"));
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
    next(error); // Pass the error to the next middleware
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out" });
};

const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate request
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address and try again",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "This Email is not registered.",
      });
    }

    // Generate a unique reset token
    const resetToken = jwt.sign(
      { id: userExists._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // Send an email with the reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: `Please click on the following link to reset your password: ${frontendUrl}/ResetPassword/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to send email",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Reset password email sent successfully. Please check your inbox.",
      });
    });
  } catch (error) {
    console.error("Forget Password error:", error);
    res.status(500).json({
      success: false,
      message: "Forget Password failed",
      error: error.message,
    });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    console.log("Received token:", token);
    console.log("Received new password:", newPassword);

    // Validate request
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both a token and a new password",
      });
    }

    // Verify the token
    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified, data:", data);
    if (!data) {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Find the user associated with the token
    const user = await User.findById(data.id);
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Parse and validate salt rounds
    const saltRounds = parseInt(process.env.HashPassword, 10);
    if (isNaN(saltRounds) || saltRounds <= 0) {
      throw new Error(
        "Invalid salt rounds value in environment variable HashPassword"
      );
    }
    console.log("Salt rounds:", saltRounds);

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, saltRounds);
    console.log("Hashed new password:", hashedPassword);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Server-side error:", error);
    res.status(500).json({
      success: false,
      message: "Change Password failed",
      error: error.message,
    });
  }
};

module.exports = {
  Register,
  login,
  logout,
  ForgetPassword,
  ChangePassword,
};
