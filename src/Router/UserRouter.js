const express = require('express');
const { Register, login, logout, ForgetPassword, ChangePassword } = require('../Controller/User');  

const Router = express.Router();

Router.post('/register', Register);
Router.post('/login', login);
Router.get('/logout', logout);  // Logout route
Router.post('/ForgetPassword', ForgetPassword);
Router.post('/changePassword/:token', ChangePassword);  // Change Password route

module.exports = Router;
