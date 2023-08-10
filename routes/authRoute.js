const express = require('express');
const { signup, signin, logout, confirmEmail, showProfile, showUsers, createProfilePicture, updateProfile, deleteProfilePicture } = require('../controllers/authController');
const router = express.Router();
const { isAuthenticated, isUser, isAdmin } = require('../middleware/auth');
const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'pictures/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    },
  });
const upload = multer({ storage: storage });



//auth routes

// /api/signup
router.post('/signup', signup);

// // /api/confirm/:confirmationCode
// router.get('/confirm/:confirmationCode', confirmEmail)

// /api/signin router
router.post('/signin', signin);

// /api/logout router
router.get('/logout', logout);

// /api/me (profile)                 
router.get('/me',isAuthenticated, showProfile);

// /api/users
router.get('/users', isAuthenticated, isAdmin, showUsers);

// /api/me creating, updating, and deleting profile picture
router.post('/me', upload.single('profilePicture'), createProfilePicture);
router.put('/me', upload.single('profilePicture'), updateProfile);
router.delete('/me', deleteProfilePicture)


module.exports= router;







