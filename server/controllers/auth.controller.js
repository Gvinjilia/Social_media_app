const User = require("../models/user.model");
const AppError = require("../utils/Error.js");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/email");

const signToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user);
    
    res.cookie("token", token, {
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "dev" ? false : true,
        httpOnly: true,
        sameSite: "Lax"
    });

    res.status(statusCode).json({
        status: "success",
        data: {
            user
        }
    });
};

const signup = catchAsync(async (req, res) => {
    const { fullname, email, password } = req.body;

    const newUser = await User.create({
        fullname,
        email,
        password
    });

    const code = newUser.createVerificationCode();

    await newUser.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get("host")}/api/auth/verify/${code}`

    sendEmail(email, 'Hello from Social media app', `
            <div style="display: flex; margin-left: 50px; flex-direction: column; gap: 5px">
                <h2 style="font-family: 'Brush Script MT', cursive;">Social media app</h2>
                <h1 style="font-family: Arial, sans-serif;">Welcome to <br /> social media app! 🎉</h1>
                <p style="font-family: Arial, sans-serif; font-size: 14px">Your space to connect, share, and be yourself. <br /> Whether you're posting updates or chatting with friends, <br /> social media is where conversations come to life</p>
                <p style="font-family: Arial, sans-serif; font-size: 14px">Click the button bellow to verify email</p>
                <button style="background-color: #8B3DFF; border: none; padding: 10px; width: 100px; border-radius: 5px"><a href='${url}' 
                style="text-decoration: none; color: white">Verify Email</a></button>
            </div>
        `);

    res.status(201).json({
        status: 'success',
        message: 'User created successfully'
    });
});

const verifyEmail = catchAsync(async (req, res, next) => {
    const { code } = req.params;

    const user = await User.findOne({ verificationCode: code });

    if(!user){
        return next(new AppError('The code is incorrect'));
    }

    user.isVerified = true,
    user.verificationCode = undefined;

    await user.save()

    res.status(200).send('<h1>User verified</h1>');
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new AppError('email or password is incorrect', 404));
    };

    const isCorrect = await user.comparePasswords(password, user.password);

    if(!isCorrect){
        return next(new AppError('email or password is incorrect', 404));
    };

    user.password = undefined;

    createSendToken(user, 200, res);

    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    });
});

// const getUsers = catchAsync(async (req, res, next) => {
//     const users = await User.find();

//     res.status(200).json(users)
// });

const autoLogin = (req, res) => {
    const user = req.user;

    res.status(201).json(user);
};

const logout = (req, res) => {
    res.clearCookie('token', {
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "dev" ? false : true,
        httpOnly: true,
        sameSite: "Lax"
    });

    res.status(200).json('logged out successfully');   
};

module.exports = { signup, login, verifyEmail, autoLogin, logout };