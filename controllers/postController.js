const cloudinary= require('../utils/cloudinary');
const Post= require('../models/postMdels');
const User = require('../models/userModels');
const ErrorResponse= require('../utils/errorResponse');
const jwt= require('jsonwebtoken');


//create post
exports.createPost = async (req, res, next) => {
    const {title, content, postedBy, image, } = req.body;
    const { file } = req;
    console.log(req.body,file);
    try{
        if(!title || !content || !file){
            res.status(400).json({success: false,message:'Please provide post detail.'})
        }else{
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Posts",
            width: 1200,
            crop: "scale"
        });
        console.log('======');
        const post = await Post.create({
            title, 
            content, 
            postedBy: req.user.name,
            // postedBy: 'postedBy',
            image:{
                public_id: result.public_id,
                url: result.secure_url },
            });
            await post.save();
            res.status(201).json({
                success: true,
                post
            })
        }
     } catch(error){
                console.log(error);
                res.status(500).json({success:false,error:error.message})
            }
}





//show all posts
exports.showPosts = async (req, res,next) =>{
    
    //console.log();
    try{
        // const posts = await Post.find().sort({createdAt: -1}).populate('_id').select('_id');
        const posts = await Post.find().sort({createdAt: -1});
        //console.log(posts);

          if (!posts) {
            return res.status(404).json({ message: 'No Posts found' });
          }
        res.status(200).json({
            success: true,
            posts
        })
    }
 catch (error){
    console.log(error);
    next(error);
}
}


//show posts by id on user
exports.showPostById= async(req, res, next) => {
   // console.log(req.params.id)
        try{
        const userId = req.params.id; // Get the user ID from the request params
        // console.log(userId)
        const post = await Post.find({ by: userId }).sort({ createdAt: -1 });
        // const post = await Post.findById(req.params.id).sort({createdAt: -1}).populate('_id', 'name');
          //const post = await Post.find().sort({createdAt: -1}).populate('_id','name');
          console.log(post);
        //   if (!post) {
        //     return res.status(405).json({ message: 'Posts not found' });
        //   }
          res.status(201).json({
            success: true,
            post
          })
    } catch (error){
            res.status(500);
            next(error);
        }
}




      




//show single post
exports.showSinglePost = async (req, res,next) =>{
    try{
        const post = await Post.findById(req.params.id).populate('comments.postedBy');
        // const post = await Post.findById(req.params.id).populate('_id').select('_id');
        res.status(201).json({
            success: true,
            post
        })
    }
 catch (error){
    next(error);
}
}




//delete post
exports.deletePost = async (req, res,next) =>{
    console.log(req.params.id);
    const currentPost = await Post.findById(req.params.id);
    console.log(currentPost);

    if (!currentPost) {
        return res.status(404).json({
            success: false,
            message: "Post not found",
        });
    }

    // delete the post image in cloudinary
    const ImgId = currentPost.image && currentPost.image.public_id;
    console.log(ImgId);
    if(ImgId){
        await cloudinary.uploader.destroy(ImgId);
    }
    try{
        const post = await Post.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message:"post deleted"

        })
    }
 catch (error){
    next(error);
}
}




// //delete post
// exports.deletePost = async (req, res, next) => {
//     try {
//       const user = await User.findById(req.params.id);
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }
  
//       const postId = req.body.postId;
//       const post = user.posts.id(postId);
//       if (!post) {
//         return res.status(404).json({
//           success: false,
//           message: "Post not found",
//         });
//       }
  
//       const ImgId = post.image && post.image.public_id;
//       if (ImgId) {
//         await cloudinary.uploader.destroy(ImgId);
//       }
  
//       post.remove();
//       await user.save();
  
//       res.status(200).json({
//         success: true,
//         message: "Post deleted",
//       });
//     } catch (error) {
//       next(error);
//     }
//   };


//update post
exports.updatePost = async (req, res,next) =>{
    try{
        const {title, content,} = req.body;
        const {file}=req;
        if(!title && !content && !file){
            return res.status(403).json({success: false,message: "Please provide edited post detail."});
        }else{
        const currentPost = await Post.findById(req.params.id);
        // console.log(currentPost);
        if (!currentPost) {
            return res.status(404).json({success: false,message: "Post not found",});
        }
        const data = {
            title: title || currentPost.title,
            content: content || currentPost.content,
            // image: image || currentPost.image,
            image:  file || currentPost.image,
        }
        // console.log("data",data)
        // if(req.body.image !== "" ){
        if(req.file ){
            const ImgId = currentPost.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }
            // const newImage = await cloudinary.uploader.upload(req.body.image, {
            const newImage = await cloudinary.uploader.upload(req.file.path, {
                 folder: 'posts', 
                 width: 1200, 
                 crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
            console.log("data",data)
        };
            const postUpdated = await Post.findByIdAndUpdate(req.params.id, data, {new: true});
            res.status(200).json({
                success: true,
                message: "Updated successfully.",
                postUpdated
            })
    } }catch(error){
        console.error('Error:', error);
        res.status(500).json({success:false,error:error.message});
    }
}



//add comment
exports.addComment = async (req, res,next) =>{
    const comment = req.body.comments;
    console.log(req.body);
    try{
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $push: {comments: {text: comment, postedBy: req.user.name}}
        },
            {new: true}
        )
        res.status(200).json({
            success: true,
            post,
        })
    }  catch (error){
        next(error);
    }
}


//add like
exports.addLike = async (req, res,next) =>{
    console.log(req.params.id);
    try{
        const post = await Post.findByIdAndUpdate(req.params.id,{
            $addToSet: {likes: req.user._id}
        },
            {new: true}
        ) 
        res.status(200).json({
            success: true,
            message: 'successfully liked',
            post
        })
    } catch (error){
        next(error);
}
}


//remove like
exports.removeLike = async (req, res,next) =>{
    try{
        const post = await Post.findByIdAndUpdate(req.params.id,{
            $pull: {likes: req.user._id}
        },
            {new: true}
        ) 
        res.status(200).json({
            success: true,
            post
        })
    } catch (error){
        next(error);
}
}

//// routes/PostRoutes.js

// const express = require('express');
// const Post = require('../models/postModel');

// const router = express.Router();

//     router.get('/', async (req, res) => {
//         const { postedBy } = req.query;
//         const query = postedBy ? { postedBy } : {};
//             try {
//                 const posts = await Post.find(query).populate('postedBy');
//                 res.send(blogPosts);
//             } catch (e) {
//                 res.status(500).send();
//             }
//         });

//     router.post('/', async (req, res) => {
//         const post = new Post({
//         ...req.body,
//         postedBy: req.user._id,
//         });
//             try {
//                 await post.save();
//                 res.status(201).send(post);
//             } catch (e) {
//                 res.status(400).send(e);
//         }
//     });

//module.exports = router;


// const sendTokenResponse = async (user, codeStatus, res)=>{
//     const token = await user.getJwtToken();
//     res
//       .status(codeStatus)
//       .cookie('token', token, {maxAge: 60 * 60 * 1000, httpOnly: true})
//          .json({
//             success: true,
//             id: user._id,
//             role: user.role,
//          })
// }
