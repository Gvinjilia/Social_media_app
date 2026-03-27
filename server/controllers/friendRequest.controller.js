const FriendRequest = require("../models/friendRequest.model");
const Friendship = require("../models/friendship.model");
const Group = require("../models/group.model");
const User = require("../models/user.model");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");

const getFriends = catchAsync(async (req, res, next) => {
    const friends = await Friendship.find({
        $or: [
            { user1: req.user._id },
            { user2: req.user._id }
        ]
    }).populate('user1').populate('user2').populate('groupId');

    res.status(200).json({
        status: 'success',
        message: 'successfully returned friends!',
        data: {
            friends
        }
    });
});

const createFriendRequest = catchAsync(async (req, res, next) => {
    const { to } = req.params;

    // Check if user sends request to himslef
    if(req.user._id.toString() == to) {
        return next(new AppError("You cant send friend request to yourself!", 400));
    };

    const friendRequestExsist = await FriendRequest.findOne({ to, from: req.user._id });

    // Check if user have already created friend request
    if(friendRequestExsist) {
        return next(new AppError("You have already sent friend request to this user!", 400));
    };

    const friendShip = await Friendship.findOne({
        $or: [
            { user1: req.user._id, user2: to },
            { user1: to, user2: req.user._id }
        ]
    });

    if(friendShip){
        return next(new AppError('Friend ship already exists!', 400));
    };

    const friendRequestExists = await FriendRequest.findOne({
        $or: [
            { from: req.user._id, to },
            { from: to, to: req.user._id }
        ]
    });

    if(friendRequestExists){
        return next(new AppError('The friend request already exists between you and the user provided!', 400));
    };

    const user = await User.findById(to);

    // Check if user exsists
    if(!user) {
        return next(new AppError("User cant be found!", 404));
    };

    const friendRequest = await FriendRequest.create({ from: req.user._id, to: user._id });

    res.status(201).json({
        status: 'success',
        message: 'Friend request sent!',
        data: {
            friendRequest
        }
    });
});

const getFriendRequests = catchAsync(async (req, res) => {
    const friendRequests = await FriendRequest.find({ to: req.user._id }).populate('from');

    res.status(200).json({
        status: 'success',
        message: 'Succesfully returned friend requests',
        data: {
            friendRequests
        }
    });
});

const getSentFriendRequests = catchAsync(async (req, res) => {
    const friendRequests = await FriendRequest.find({ from: req.user._id }).populate('to');

    res.status(200).json({
        status: 'success',
        message: 'Succesfully returned sent friend requests',
        data: {
            friendRequests
        }
    });
});

const cancelFriendRequest = catchAsync(async (req, res, next) => {
    const { to } = req.params;

    const friendRequest = await FriendRequest.findOneAndDelete({
        from: req.user._id,
        to
    });

    if(!friendRequest) {
        return next(new AppError('Friend request not found!', 404));
    };

    res.status(200).json({
        status: 'success',
        message: 'Friend request canceled!'
    });
});

const acceptFriendRequest = catchAsync(async (req, res, next) => {
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest) {
        return next(new AppError("Friend request dont exsist!", 404));
    }

    const friendShip = await Friendship.findOne({
        $or: [
            { user1: friendRequest.from, user2: friendRequest.to },
            { user1: friendRequest.to, user2: friendRequest.from }
        ]
    });

    if(friendShip) {
        return next(new AppError("Friendship exists!", 400));
    }

    const newGroup = await Group.create({
        members: [friendRequest.from, friendRequest.to]
    });

    const created = await Friendship.create({ user1: friendRequest.from, user2: friendRequest.to, groupId: newGroup._id });

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(201).json({
        status: 'success',
        message: 'Friend request accepted!',
        data: {
            created
        }
    });
});

const rejectFriendRequest = catchAsync(async (req, res, next) => {
    const { to } = req.params;

    const friendRequestExsist = await FriendRequest.findOne({ from: to, to: req.user._id });

    if(!friendRequestExsist) {
        return next(new AppError("You can't reject the friend request because it does not exist!", 404));
    };

    const user = await User.findById(to);

    if(!user) {
        return next(new AppError("User cant be found!", 404));
    };

    await FriendRequest.deleteOne({ from: to, to: req.user._id });

    res.status(204).json({
        status: 'success',
        message: 'Friend request sent!'
    });
});

const deleteFriend = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if(!user){
        return next(new AppError('User does not exist', 404));
    };

    const friendShip = await Friendship.findOneAndDelete({
        $or: [
            { user1: req.user._id, user2: userId },
            { user1: userId, user2: req.user._id }
        ]
    });

    if(!friendShip){
        return next(new AppError('Friend ship does not exist!', 404));
    };

    res.status(204).json({
        status: 'success',
        message: 'Friend removed successfully!'
    });
});

module.exports = { createFriendRequest, getFriendRequests, getSentFriendRequests, cancelFriendRequest, acceptFriendRequest, rejectFriendRequest, deleteFriend, getFriends };