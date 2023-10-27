const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const jwt = require('jsonwebtoken');


const postSchema = new mongoose.Schema(
    {
    //     id: {
    //     type: Number,
    //     autoIncrement: true,
    //     unique:true,
    //     required:true,
    // },
        title: {
            type: String,
            required: [true, "title is required"],
        },
        content: {
            type: String,
            required: [true, "content is required"],
        },
        postedBy: {
            // type: mongoose.Schema.Types.ObjectId,
            type: String,
            //type: ObjectId,
            ref: "User",
            //required: true,
        },
        by: {
            // type: mongoose.Schema.Types.ObjectId,
            type: ObjectId,
            ref: "User",
            //required: true,
        },
        image: {
            url: String,
            public_id: String,
            //required:[true, "image is required"],
        },
        likes: [
            {
                type: ObjectId,
                ref: "User"
            }],
        comments: [
            {
                text: String,
                created: {
                    type: Date,
                    default: Date.now
                },
                postedBy: {
                    //type: mongoose.Schema.Types.ObjectId,
                    //type: ObjectId,
                    type: String,
                    ref: "User"
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);