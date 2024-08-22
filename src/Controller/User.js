const User = require("../Model/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ErrorHandler = require("../Utils/error.js");
const cloudinary = require("../MiddleWare/Cloudinary.js");
const fs = require('fs');


const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const mongoose = require('mongoose');

const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(ErrorHandler(400, "invalid_user_id"));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(ErrorHandler(400, "user not found in database"));
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      user
    });
    
  } catch (error) {
    next(error);
  }
};


const Register = async (req, res, next) => {
  try {
    const { name, email, password, phone, gender } = req.body;
     const avatar = req.file;

    if (!(name && email && password && phone && gender )) {
      return next(ErrorHandler(404, "all fields are required"));
    }

    if (!avatar){
      return next(ErrorHandler(400, 'Image is required'));
      }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(ErrorHandler(400, "Email already exists and does not exist"));
    }

    const saltRounds = parseInt(process.env.HashPassword, 10);
    if (isNaN(saltRounds)) {
      throw new Error("Invalid salt rounds value in environment variable");
    }

    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const result = await cloudinary.uploader.upload(avatar.path, {
      folder: "MyHome2U/Users",

    });

         if(!result ){
          fs.unlink(avatar.path);
          return next(ErrorHandler(500, 'Failed to upload image to cloudinary')); 
         }

         fs.unlinkSync(avatar.path);
    
    const profile_Image_Url = result.secure_url;
    const public_id = result.public_id;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      avatar: {
        public_id: public_id,
        url: profile_Image_Url,
      },
      gender,
    });


    res.status(200).json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const Users = async (req, res, next) => {
  try {
    const users = await User.find({});

    if(!users){
      return next(ErrorHandler(400, "no users found"));
    }

    res.status(200).json(
      { 
      success: true, 
      users
     });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);

    if (!user) {
      return next(ErrorHandler(404, "User not found"));
    }

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id, (error, result) => {
        if (error) {
          console.error("Cloudinary deletion error:", error);
        } else {
          console.log("Cloudinary deletion result:", result);
        }
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("User delete error:", error);
    next(ErrorHandler(500, "Server Error"));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return next(ErrorHandler(400, "Please provide all required fields"));
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return next(ErrorHandler(400, "This Email is not Registered."));
    }

    const isMatch = await bcryptjs.compare(password, userExists.password);
    if (!isMatch) {
      return next(ErrorHandler(400, "Incorrect Password"));
    }

    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    userExists.password = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS in production
      sameSite: 'None'
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userExists
    });
  } catch (error) {
    next(error);
  }
};


const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
    sameSite: 'Strict', // or 'Lax' depending on your needs
    path: '/' // or the specific path used when setting the cookie
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

const ForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
        return next(ErrorHandler(400, "Please enter a valid email address and try again"));
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return next(ErrorHandler(400, "This Email is not registered"));
    }

    const resetToken = jwt.sign(
      { id: userExists._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

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
        return next(ErrorHandler(400, "Failed to send email"));
      }

      res.status(200).json({
        success: true,
        message:
          "Reset password email sent successfully. Please check your inbox.",
      });
    });
  } catch (error) {
    next(error);
  }
};

const ChangePassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    console.log("Received token:", token);
    console.log("Received new password:", newPassword);

    if (!token || !newPassword) {
      return next(ErrorHandler(400, "Please provide both a token and a new password"));
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified, data:", data);
    if (!data) {
      return next(ErrorHandler(400, "invalid_token"));
    }

    const user = await User.findById(data.id);
    console.log("User found:", user);
    if (!user) {
      return next(ErrorHandler(400, "user not found"));
    }

    const saltRounds = parseInt(process.env.HashPassword, 10);
    if (isNaN(saltRounds) || saltRounds <= 0) {
      throw new Error(
        "Invalid salt rounds value in environment variable HashPassword"
      );
    }

    const hashedPassword = await bcryptjs.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateSingleUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { name, email, password, phone, role, gender, isActive} = req.body;
    
    const avatar = req.file;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(ErrorHandler(400, "Invalid User ID format"));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(ErrorHandler(404, "User not found in database"));
    }


    if (avatar) {

      if (user.avatar && user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const result = await cloudinary.uploader.upload(avatar.path, {
        folder: "MyHome2U/Users",
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      
    }

    user.name = name !== undefined ? name : user.name;
    user.email = email !== undefined ? email : user.email;
    user.password = password !== undefined ? await bcryptjs.hash(password, parseInt(process.env.HashPassword, 10)) : user.password;
    user.phone = phone !== undefined ? phone : user.phone;
    user.role = role !== undefined ? role : user.role;
    user.gender = gender !== undefined ? gender : user.gender;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  Register,
  login,
  logout,
  ForgetPassword,
  ChangePassword,
  Users,
  deleteUser,
  getSingleUser,
  updateSingleUser
};
