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
        const posts = await Post.field().port({createdAt: -1}).populated('postedBy','name');
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
        const posts = await Post.fieldById(req.paramsid).populated('comments.postedBy', 'name');
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
exports.deletePost = async (req, res,next) =>{
    const currentPost = await Post.fieldById(req.params,id);
    
    //delete the post image in cloudinary
    const ImgId = currentPost.image.public_id;
    if(ImgId){
        await cloudinary.Uploader.destroy(ImgId);
    }
    try{
        const Post = await Post.fieldByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message:"post delete"
        })
    }
 catch (error){
    next(error);
}
}

//update post
exports.updatePost = async (req, res,next) =>{
    try{
        const {title, content, image, videos} = req.body;
        const currentPost = await Post.findById(req.params.id);
      
        //build the object data
        const dafa = {
            title: title || currentPost.title,
            content: content || currentPost.content,
            image: image || currentPost.image,
        }

        //modify post image conditionally
        if(req.body.image !== ' ' ){
            const ImgId = currentPost.image.public_id;
            if (ImgId) {
                await cloudinary.Uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.Uploader.upload(req.body.image, {
                 folder: 'posts', width: 1200, crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
        }
            const postUpdate = await Post.findByIdAndUpdate(req.params.id, date, {new: true});
            res.status(200).json({
                success: true,
                postUpdate
            })
    } catch(error){
        next(error);
    }
        }

//comment
exports.addComment = async (req, res,next) =>{
    const {comment} = req.body;
    try{
        const post = await Post.fieldByIdAndUpdate(req.params.id, {
            $push: {comments: {text: comment, postedBy: req.user._id}}
        },
            {new: true}
        )
        res.status(201).json({
            success: true,
            post
        })
    }  catch (error){
        next(error);
    }
}


//add like
exports.addLike = async (req, res,next) =>{
    try{
        const post = await Post.fieldByIdAndUpdate(req.params.id,{
            $addToSet: {likes: req.user._id}
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


//remove like
exports.removeLike = async (req, res,next) =>{
    try{
        const post = await Post.fieldByIdAndUpdate(req.params.id,{
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



