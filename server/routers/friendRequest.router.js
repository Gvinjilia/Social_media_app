const express = require('express');
const { getFriendRequests, getSentFriendRequests, cancelFriendRequest, createFriendRequest, acceptFriendRequest, rejectFriendRequest, deleteFriend, getFriends } = require('../controllers/friendRequest.controller');
const { protect } = require('../middleware/auth.middleware');

const friendRequestRouter = express.Router();

friendRequestRouter.get('/', protect, getFriends);
friendRequestRouter.get('/friend-requests', protect, getFriendRequests);
friendRequestRouter.get('/sent-friend_requests', protect, getSentFriendRequests);

friendRequestRouter.post('/:to', protect, createFriendRequest);
friendRequestRouter.post('/accept/:requestId', protect, acceptFriendRequest);

friendRequestRouter.delete('/cancel/:to', protect, cancelFriendRequest)
friendRequestRouter.delete('/reject/:to', protect, rejectFriendRequest);
friendRequestRouter.delete('/delete/:userId', protect, deleteFriend);

module.exports = friendRequestRouter;