const express = require("express");
const verifyToken = require("../MiddleWare/verifyToken");
const {
  Register,
  login,
  logout,
  ForgetPassword,
  ChangePassword,
  Users,
  deleteUser,
  getSingleUser,
  updateSingleUser,
} = require("../Controller/User");

const Router = express.Router();

Router.post("/register", Register);
Router.post("/login", login);
Router.get("/logout", logout); // Logout route
Router.get("/users",Users); // Reset Password route (not implemented)
Router.post("/ForgetPassword", ForgetPassword);
Router.post("/changePassword/:token", ChangePassword); // Change Password route
Router.delete("/delete/:id",deleteUser); // Delete
Router.get("/getSingleUser/:id",getSingleUser);
Router.put("/updateSingleUser/:id", verifyToken, updateSingleUser);

module.exports = Router;
