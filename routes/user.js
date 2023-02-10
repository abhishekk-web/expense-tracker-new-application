// we are requiring the express libraries here

const express = require('express');

// here we are using the router function that provided by express

const router = express.Router();

// here we are requiring all the controllers

const userController = require('../controllers/user'); // user controller

//  usercontroller for sign up

router.post("/signup", userController.signUp)

// usercontroller for login

router.post("/login", userController.login);

module.exports = router;