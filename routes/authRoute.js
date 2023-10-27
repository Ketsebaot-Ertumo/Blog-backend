const express = require('express');
const { signup, signin, logout, confirmEmail, showProfile, showUsers, createProfilePicture, updateProfile, deleteProfilePicture, deleteuser, deleteMyAccount, editUser, showUser } = require('../controllers/authController');
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
// /api/signin router
router.post('/signin', signin);
// /api/logout router
router.get('/logout', logout);


// /api/users                 
router.get('/me',isAuthenticated, showProfile);
router.get('/users', isAuthenticated, isAdmin, showUsers);
router.get('/user', isAuthenticated, showUser);
router.delete('/user/delete', isAuthenticated, deleteuser);
router.get('/me/delete', isAuthenticated, deleteMyAccount);
router.post('/me',isAuthenticated, upload.single('profilePicture'), createProfilePicture);
router.put('/me',isAuthenticated, upload.single('profilePicture'), updateProfile);
router.delete('/me',isAuthenticated, deleteProfilePicture);
router.put('/me',isAuthenticated, editUser);


module.exports= router;







