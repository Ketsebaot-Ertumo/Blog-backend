const express = require('express');
const router = express.Router();
const { createPost, showPost, showPostById, showSinglePost , deletePost, updatePost, addComment, addLike, removeLike } = require('../controllers/postController');
const { isAuthenticated, isAdmin, isUser } = require('../middleware/auth');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
const upload = multer({ storage: storage })
  

//blog routes
router.post('/post/create', upload.single('image'), createPost);
router.get('/posts/show', showPost);
//router.get('/posts/show/:id',isAuthenticated, isUser, showPostById);
router.get('/posts/show/:id', showPostById);
router.get('/post/:id', showSinglePost);
//router.post('/edit/post/:id', isAuthenticated, updatePost);
router.delete('/delete/post/:id', isAuthenticated, deletePost);
router.put('/update/post/:id', isAuthenticated, updatePost);
router.put('/comment/post/:id', isAuthenticated, addComment);
router.put('/addlike/post/:id', isAuthenticated, addLike);
router.put('/removelike/post/:id', isAuthenticated, removeLike);


module.exports = router;