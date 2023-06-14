const express = require('express');
const router = express.Router();
const { createPost, showPost } = require('../controllers/postController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

//blog routes
router.post('/post/create', isAuthenticated, isAdmin, createPost);
router.post('/post/show', showPost);

module.exports = router;