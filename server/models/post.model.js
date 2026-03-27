const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }, 
    fullname: {
        type: String,
        required: [true, 'fullname is required']
    },
    profileImage: {
        type: String
    },
    postImage: String,
    title: {
        type: String,
        required: [true, 'title is required'],
    },
    content: {
        type: String,
        required: [true, 'content is required']
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }],
    tags: [String]
}, { timestamps: true });

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;