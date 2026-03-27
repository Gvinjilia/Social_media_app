const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getUserInfo, getUserPosts, getUsers } = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.route('/').get(protect, getUsers);
userRouter.route('/:id').get(protect, getUserInfo);
userRouter.route('/:userId/posts').get(protect, getUserPosts);

module.exports = userRouter;