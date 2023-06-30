const express = require('express');
const { signup, signin, logout, userProfile, updateCurrentUser, uploadProfilePicture } = require('../controllers/authController');
const router = express.Router();
const { isAuthenticated, isUser } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });




//auth routes
// /api/signup
router.post('/signup', signup);

// /api/signin router
router.post('/signin', signin);

// /api/logout router
router.get('/logout', logout);

//api/me (profile) router
router.get('/me', userProfile);                //e?

// router.get('/me', isAuthenticated, (req, res) => {
// res.send(req.user);
// });

// /api/me profile picture router
router.patch('/me', upload.single('profilePicture'), uploadProfilePicture);




module.exports= router;







