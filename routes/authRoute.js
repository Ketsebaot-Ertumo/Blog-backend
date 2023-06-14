const express = require('express');
const { signup, signin, logout, userProfile } = require('../controllers/authController');
const router = express.Router();
const User = require('../models/userModels');
const { isAuthenticated } = require('../middleware/auth');

//auth route
//api/signup
router.post('/signup', signup);

// /api/signin router
router.post('/signin', signin);

// /api/log out router
router.get('/logout', logout);

// /api/log out router
router.get('/me', isAuthenticated, userProfile);

module.exports= router;







