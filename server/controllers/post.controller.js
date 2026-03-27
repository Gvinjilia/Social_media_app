const Post = require("../models/post.model");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");

const formatMongoQuery = (query) => {
    const mongoQuery = {};

    for (const [key, value] of Object.entries(query)) {
        const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
        if (match) {
            const [, field, op] = match;
            mongoQuery[field] = {
                ...mongoQuery[field],
                [`$${op}`]: isNaN(value) ? value : Number(value)
            };
        } else {
            mongoQuery[key] = isNaN(value) ? value : Number(value);
        }
    }

    return mongoQuery;
};

const limitFieldsFunc = (limitFields) => {
    const queryParts = {};

    if(limitFields){
        limitFields.split(',').forEach(field => {
            queryParts[field] = 0;
        })
    }

    return queryParts;
};

const getPosts = async (req, res) => {
    const { sort, tags, ...filters } = req.query;
    const mongoQuery = formatMongoQuery(filters);

    if(tags) {
        mongoQuery.tags = { $all: tags.split(",") }
    }
    
    const posts = await Post.find(mongoQuery).sort(sort);

    res.status(200).json({
        status: "success",
        length: posts.length,
        data: {
            posts
        }
    });  
};

const getPostById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if(!post){
        return next(new AppError('Post not found', 404));
    }

    res.status(200).json(post);
});

const getUserPosts = catchAsync(async (req, res, next) => {
    const posts = await Post.find({ userId: req.user._id });

    res.status(200).json(posts);
});

const createPost = catchAsync(async (req, res) => {
    const { title, content, tags, likesCount } = req.body;

    const newPost = await Post.create({
        userId: req.user._id,
        fullname: req.user.fullname,
        title,
        content,
        tags,
        likesCount,
        postImage: req.file ? req.file.filename : undefined
    });

    res.status(201).json(newPost);
});

const updatePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, content, likes, tags } = req.body;

    const post = await Post.findById(id);

    if(!post){
        return next(new AppError("Post can't be found", 404));
    }

    if(req.user._id.toString() != post.userId){
        return next(new AppError("You do not have permission to delete other people's posts", 401));
    };

    const updated = await Post.findByIdAndUpdate(id, { $set:  {
        title, content, likes, tags
    }}, { new: true });

    res.status(200).json(updated);
});

const deletePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if(!post){
        return next(new AppError("Post can't be found", 404));
    }

    if(req.user._id.toString() != post.userId){
        return next(new AppError("You don't have permission to delete other people's posts", 401));
    }

    await Post.findByIdAndDelete(id);

    res.status(204).send();
});

const likePost = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    let updatedPost;

    if(!post){
        return next(new AppError('Post not found!', 404));
    };

    const exists = post.likes.some((id) => id.toString() === req.user._id.toString());

    if(exists){
        updatedPost = await Post.findByIdAndUpdate(id, { $pull: { likes: req.user._id }}, {
            new: true
        });
    } else {
        updatedPost = await Post.findByIdAndUpdate(id, { $push: { likes: req.user._id } }, {
            new: true
        });
    };

    res.status(200).json({
        status: 'success',
        data: {
            updatedPost
        }
    });
});

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost, getUserPosts, likePost };