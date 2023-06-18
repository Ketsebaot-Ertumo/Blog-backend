const express = require('express');
const { signup, signin, logout, userProfile } = require('../controllers/authController');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

//auth routes
// /api/signup
router.post('/signup', signup);

// /api/signin router
router.post('/signin', signin);

// /api/log out router
router.get('/logout', logout);

// /api/log out router
router.get('/me', isAuthenticated, userProfile);

module.exports= router;







