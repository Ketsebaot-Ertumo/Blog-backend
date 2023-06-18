const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');

// check is user authenticated
exports.isAuthenticated = async(req, res, next) => {
    const {token} = req.cookies;

    //make sure token exist
    if(token){
        return next(new ErrorResponse('You must log in', 401));
    }
    try{
        //verfy token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    }
    catch(error){
        return next(new ErrorResponse('You must Login', 402));
    }
}

//middleware for admin
exports.isAdmin = (req, res, next) =>{
    if(req.user.role === 'user'){
        return next(new ErrorResponse('Access denied, you must an admin', 401));
    }
    next();
}