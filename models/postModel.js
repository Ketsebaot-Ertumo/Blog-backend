const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const jwt = require('jsonwebtoken');


const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
        },
        content: {
            type: String,
            required: [true, "content is required"],
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            //type: String,
            //type: ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            url: String,
            public_id: String,
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
                    type: mongoose.Schema.Types.ObjectId,
                    //type: ObjectId,
                    ref: "User"
                },
            },
        ],
    },
    { timestamps: true }
);


// //return a JWT
// userSchema.methods.getJwtToken = function (){
//     return jwt.sign({ id: this.id}, process.env.JWT_SECRET, {expiresIn: 3600});
// }



module.exports = mongoose.model("Post", postSchema);