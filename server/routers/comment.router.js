const express = require('express');
const { getCommentByItsId, getCommentByPostId, createComment, deleteComment } = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth.middleware');

const commentRouter = express.Router();

commentRouter.route('/:postId').post(protect, createComment);
commentRouter.route('/post/:postId').get(protect, getCommentByPostId);
commentRouter.route('/:id').get(protect, getCommentByItsId).delete(protect, deleteComment);

module.exports = commentRouter;