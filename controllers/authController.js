const User = require('../models/userModels');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary= require('../utils/cloudinary');
const jwt= require('jsonwebtoken');



exports.signup = async (req, res, next) => {
    const {email}= req.body;
    const userExist= await User.findOne({email});
    if (userExist){
        return next(new ErrorResponse("E-mail already registered", 400));
    }
    try{
        const user =await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        } )    
    }catch (error){
        next(error);
    }

}

exports.signin = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        //validation
        if (!email){
            return next(new ErrorResponse("Please add an email", 403));
        }
        if (!password){
            return next(new ErrorResponse("Please add a password", 403));
        }
        //check user email
        const user = await User.findOne({email});
        if (!user){
            return next(new ErrorResponse("Invalid credentials", 400));
        }
        //check password
        const isMatched = await user.comparePassword(password);
        if(!isMatched){
            return next(new ErrorResponse("Invalid credentials/password is incorrect", 400));
        }
        sendTokenResponse(user, 200, res);
    }
    catch (error){
        next(error);
    }
}


//logout
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
}

//user profile
exports.userProfile = async(req, res) => {
    //const user = await User.findById(req.user._id).select('password');
    const user = await User.findOne({email: req.body.email}).select('password');
    res.status(200).json({
        success: true,
        user
    });
}



// //user profile
// exports.userProfile = (req, res) => {
// res.send(req.user);
// };


//create user profile picture and updating

// Upload a user's profile picture to Cloudinary
exports.uploadProfilePicture = async (req, res, next) => {
    //const {email, password} = req.body;
    console.log(req.body);

    try {
      const user = await User.findOne({ email: req.body.email });
        
      //Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile-pictures',
            width: 1200,
            crop: "scale"
        // public_id: `profile-pictures/${user._id}`,
        // overwrite: true,
      });
  
      // set the user's profile picture in the database
      user.profilePicture.url = result.secure_url;
      user.profilePicture.public_id = result.public_id;
      await user.save();
  
      // Return the updated user document
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  };



// //user profile update
// exports.updateCurrentUser = async (req, res, next) => {
//     const {name, profilePicture } = req.body;
//     console.log(req.body);
//     try {
//         //console.log(req.user._id);
//         const user = await User.findById(req.body._id);
    
//         // if (!user) {
//         //   return res.status(404).json({ message: 'User not found' });
//         // }
//         if (req.file ) {
//           user.profilePicture = {
//             url: req.file.url,
//             public_id: req.file.public_id,
//           };
//           await user.save();
//         }
    
//         if (req.body.name) {
//           user.name = req.body.name;
//           await user.save();
//         }
    
//         res.status(200).json({ message: 'User updated successfully' });
//       } catch (err) {
//         next(err);
//       }
//     };
    
    
  




//user profile update
// exports.updateCurrentUser = async(req,res) =>{

//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['name'];
//     if (req.file) {
//         allowedUpdates.push('profilePicture');
//         req.body.profilePicture = req.file.filename;
//     }
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' });
//     }
//     try {
//         updates.forEach((update) => (req.user[update] = req.body[update]));
//         await req.user.save();
//         res.send(req.user);

//     } catch (e) {
//     res.status(400).send(e);
//     }
//     }




const sendTokenResponse = async (user, codeStatus, res)=>{
    const token = await user.getJwtToken();
    res
      .status(codeStatus)
      .cookie('token', token, {maxAge: 60 * 60 * 1000, httpOnly: true})
         .json({
            success: true,
            id: user._id,
            role: user.role,
         })
}

