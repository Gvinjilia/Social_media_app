const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const AppError = require("../utils/Error.js");
const catchAsync = require("../utils/catchAsync");

const getCommentByItsId = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if(!comment){
        return next(new AppError('Comment not found!', 404));
    };

    res.status(200).json(comment);
});

const getCommentByPostId = catchAsync(async (req, res, next) => {
    const { postId } = req.params;

    const comment = await Comment.find({ postId }).populate('userId');

    console.log(comment);

    if(!comment){
        return next(new AppError('Comment not found by postId!', 404));
    };

    res.status(200).json(comment);
});

const createComment = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);

    if(!post){
        return next(new AppError('Post not found!', 404));
    };

    const created = await Comment.create({
        userId: req.user._id,
        postId,
        text
    });

    const newComment = await Comment.findById(created._id).populate('userId');

    post.comments.push(newComment._id);

    await post.save();

    res.status(201).json(newComment);
});

const deleteComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if(!comment){
        return next(new AppError('Comment not found!', 404));
    };

    if(comment.userId.toString() !== req.user._id.toString()){
        return next(new AppError("You are not allowed to delete other people's post comments", 400));
    };

    res.status(204).send();
});

module.exports = { getCommentByItsId, getCommentByPostId, createComment, deleteComment };