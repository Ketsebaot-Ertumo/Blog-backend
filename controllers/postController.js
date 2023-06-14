const cloudinary=require('cloudinary');
const Post= require('../models/postModel');
const ErrorResponse= require('../utils/errorResponse');
const { json } = require('express');

//create post
exports.createPost = async(req,res, next) =>{
    const {title, content, postedBy, image, videos, likes, comments } = req.body;

    try{
        //upload image in cloudinary
        const result = await cloudinary.UploadStream.upload(image, {
            folder: "posts",
            width: 1200,
            crop: "scale"
        })
        const post = await Post.createPost[{
            title, 
            content, 
            postedBy: req.user._id,
            image:{
                public_id: result.public_id,
                url: result.secure_url
            },

          //upload video  

    }];
    res.status(201),json({
        success: true,
        post
    })

    }
    catch(error){
        console.log(error);
        next(error);

    }

}

//show post
exports.showPost = async (req, res,next) =>{
    try{
        const posts = await Post.field().port({createdit: -1}).populated('postedBy','name');
        res.status(201).json({
            success: true,
            posts
        })
    }
 catch (error){
    next(error);
}
}

//show single post
exports.showSinglePost = async (req, res,next) =>{
    try{
        const posts = await Post.fieldById(req.user._id).port({createdit: -1}).populated('postedBy','name');
        res.status(201).json({
            success: true,
            posts
        })
    }
 catch (error){
    next(error);
}
}

//delete post

//update post

//