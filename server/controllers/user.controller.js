const Post = require("../models/post.model");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    console.log('efduhiwef');

    res.status(200).json(users);
});

const getUserInfo = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if(!user){
        return next(new AppError('user not found', 404));
    };

    res.status(200).json(user);
});

const getUserPosts = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const posts = await Post.find({ userId }).populate('userId');

    if(!posts){
        return next(new AppError('user id is incorrect!', 404))
    };

    res.status(200).json(posts);
});

module.exports = { getUsers, getUserPosts, getUserInfo };