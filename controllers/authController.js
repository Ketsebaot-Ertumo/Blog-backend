const User = require('../models/userModels');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary= require('../utils/cloudinary');
const jwt= require('jsonwebtoken');
// const generateConfirmationCode = require('../utils/generateConfirmationCode');
// const sendConfirmationEmail = require('../utils/sendConfirmationEmail');


exports.signup = async (req, res, next) => {
    const {email}= req.body;
    const userExist= await User.findOne({email});

    if (userExist){
        return next(new ErrorResponse("E-mail already registered", 400));
    }
    try{
        const user =await User.create(req.body);
        
        // const confirmationCode = generateConfirmationCode();// my own func. to generate a unique code
        // user.confirmationCode= confirmationCode;
        // await user.save();
        // await sendConfirmationEmail(user.email, confirmationCode);

        // res.status(201).json({
        //     success: true,
        //     //message: 'Please check your email to confirm your account',
        //     user 
        // } ); 
        sendTokenResponse(user, 200, res);

    }catch (error){
        next(error);
    }
}


// exports.confirmEmail = async (req, res, next) => {
//     const { confirmationCode } = req.params;
  
//     try {
//       const user = await User.findOne({ confirmationCode });
//       if (!user) {
//         return next(new Error('Invalid confirmation code'));
//       }
//       user.isConfirmed = true;
//       user.confirmationCode = undefined;
//       await user.save();
//       res.status(200).json({ success: true, message: 'Your account has been confirmed' });
//     } catch (error) {
//       next(error);
//     }
//   };


// exports.confirm = (req, res, next) => {
//     const {confirmationCode} = req.params.confirmationCode;

//     //Update user status in database
//     confirmUserInDatabase(confirmationCode)
//     .then(()=>{res.status(200).send(`Account confirmed.`);})
//     .catch((err) => {console.error(err);
//             res.status(500).send('Error confirming account.');
//             next(err)});
// }



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


//show profile
exports.showProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('name email role profilePicture').sort({updatedAt: -1});
    // const user = await User.findOne().select('password');
    res.status(200).json({
        success: true,
        user
        //user:{user.email, user.profilePicture}
    });
},


exports.showUser = async (req, res) => {
    const {email}=req.body;
    const user = await User.findOne({email}).select('name email profilePicture').sort({updatedAt: -1});
    // const user = await User.findOne().select('password');
    res.status(200).json({
        success: true,
        user
        //user:{user.email, user.profilePicture}
    });
},


//show all user
exports.showUsers = async (req, res) => {
    const users = await User.find().select('name email role profilePicture').sort({updatedAt: -1});
    res.status(200).json({
        success: true,
        users
        //users:{user.email, user.profilePicture}
    });
},


exports.deleteuser= async (req, res) => {
        const { email } = req.body;
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          await user.remove();
          res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Error deleting user' });
        }
}


exports.deleteMyAccount = async (req, res) => {
    try {
      const user = await User.findByIdAndRemove(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Your account deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  };


  exports.editUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    try {
      const user = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({success:true, user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error editing user' });
    }
  };



// creating profile picture
exports.createProfilePicture= async (req, res) => {
    console.log(req.body);
    //const user = await User.findById(req.user._id);
    const user = await User.findOne({ email: req.user.email });
    //Check if the user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
       // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile-pictures',
        width: 1200,
        crop: "scale"
    });
    
    user.profilePicture.url = result.secure_url;
    user.profilePicture.public_id = result.public_id;
    await user.save();
    res.status(200).json(user);
},


//user profile update
// exports.updateCurrentUser = async (req, res, next) => {
    exports.updateProfile = async (req, res, next) => {
      // console.log(req.file?true:false)
        try {
            // const user = await User.findById(req.body._id);
            const user = await User.findOne({ email: req.user.email });
    
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            // Upload the image to Cloudinary
            if (req.file ) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile-pictures',
                width: 1200,
                crop: "scale"
            });console.log(result)
            user.profilePicture.url = result.secure_url;
            user.profilePicture.public_id = result.public_id;
            }
            //await user.save();
            //res.status(200).json(user);
    
            if (req.body.name) {
              user.name = req.body.name;
              await user.save();
            }
            if (req.body.email) {
                user.email = req.body.email;
                await user.save();
              }
            await user.save();
            res.status(200).json({ 
                message: 'User updated successfully',
                user
            });
          } catch (err) {
            next(err);
          }
        };



//deleting profile picture
exports.deleteProfilePicture= async (req, res) => {
    
    console.log(req.body);
    // const user = await User.findById(req.user._id);
    const user = await User.findOne({ email: req.body.email });
    user.profilePicture = null;
    await user.save();
    res.status(200).json(user);
}




const sendTokenResponse = async (user, codeStatus, res)=>{
    const token = await user.getJwtToken();
    //console.log(token);
    res
      .status(codeStatus)
       .cookie('token', token, {maxAge: 6*60 * 60 * 1000, httpOnly: true})
         .json({
            success: true,
            id: user._id,
            role: user.role,
            // name: user.name,
            // email: user.email,     
         });
}

