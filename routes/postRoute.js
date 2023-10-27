const express = require('express');
const router = express.Router();
const { createPost, showPosts, showPostById, showSinglePost , deletePost, updatePost, addComment, addLike, removeLike } = require('../controllers/postController');
const { isAuthenticated, isAdmin, isUser } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'images/' });
// const upload = multer({ storage: multer.memoryStorage() });
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 } // 50 megabytes
// });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'images/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname)
//     },
//   });
// const upload = multer({ storage: storage });
// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50 megabytes
// });

//blog routes
router.post('/post/create',isAuthenticated, upload.single('image'), createPost);
router.get('/posts/show', showPosts);
router.get('/posts/show/:id',isAuthenticated, isUser, showPostById);
router.get('/post/:id', showSinglePost);
router.delete('/delete/post/:id',isAuthenticated,  deletePost);
router.put('/update/post/:id', isAuthenticated, upload.single('image'), updatePost);
//router.post('/edit/post/:id', isAuthenticated, editPost);
router.put('/comment/post/:id', isAuthenticated, addComment);
// router.put('/addlike/post/:id', isAuthenticated, addLike);
router.put('/addlike/post/:id', isAuthenticated, addLike);
router.put('/removelike/post/:id', isAuthenticated, removeLike);


module.exports = router;