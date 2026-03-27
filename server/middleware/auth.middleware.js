const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if(!token){
            return next(new AppError('You are not authorized!', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return next(new AppError('Invalid token!', 401));
        }

        const user = await User.findById(decoded.id);

        if(!user){
            return next(new AppError('User does not exist', 404));
        }


        req.user = user;

        next();
    } catch(err){
        if (err.name === "TokenExpiredError") {
            return next(new AppError('your authorization time has expired!', 400));
        }

        return next(new AppError("you are not authorized!", 401));
    }
};

const allowedTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission!', 401));
        }

        next();
    };
};

module.exports = { protect, allowedTo };