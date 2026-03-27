const express = require('express');
const { deletePost, updatePost, createPost, getPostById, getPosts, getUserPosts, likePost } = require('../controllers/post.controller.js');
const upload = require('../config/uploadImg.js');

const { protect } = require('../middleware/auth.middleware.js');

const postRouter = express.Router();

postRouter.route('/').get(protect, getPosts).post(protect, upload.single('postImg'), createPost);

postRouter.get('/user', protect, getUserPosts);

postRouter.route('/:id').get(protect, getPostById).patch(protect, updatePost).delete(protect, deletePost);
postRouter.route('/:id/likePost').post(protect, likePost);

module.exports = postRouter;