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

const upload = require("../MiddleWare/multer");

const Router = express.Router();

Router.post("/register",upload.single("avatar"), Register);
Router.post("/login", login);
Router.get("/logout", logout);
Router.get("/users",Users); 
Router.post("/ForgetPassword", ForgetPassword);
Router.post("/changePassword/:token", ChangePassword); 
Router.delete("/delete/:id",deleteUser);
Router.get("/getSingleUser/:id",getSingleUser);
Router.put("/updateSingleUser/:id",upload.single("avatar"),updateSingleUser);

module.exports = Router;

