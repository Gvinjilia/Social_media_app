const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user id is required!']
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: [true, 'post id is required!']
    },
    text: {
        type: String,
        required: [true, 'The text field is required']
    }
}, { timestamps: true });

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;