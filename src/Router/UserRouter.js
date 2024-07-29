// Router file
const express = require('express');
const { Register, login, logout } = require('../Controller/User');  

const Router = express.Router();

Router.post('/register', Register);
Router.post('/login',login);
Router.get('/logout',logout);  // Logout route

module.exports = Router;
