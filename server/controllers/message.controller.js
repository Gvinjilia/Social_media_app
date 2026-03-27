const Group = require("../models/group.model");
const Message = require("../models/message.model");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");

const sendMessage = catchAsync(async (req, res, next) => {
    const io = require("../app");

    const { groupId } = req.params;
    const { text } = req.body;

    const senderId = req.user._id;

    const group = await Group.findById(groupId);

    if(!group){
        return next(new AppError('Group not found', 404));
    }

    const isMember = group.members.some(id => id.toString() == req.user._id.toString());

    if (!isMember) {
        return next(new AppError('You are not a member of this group', 400));
    }

    const encryptedText = Message.encryptText(text);

    const newMessage = await Message.create({ senderId, groupId, text: encryptedText });

    io.to(`group:${groupId}`).emit('group-message', {
        ...newMessage.toObject(), text: Message.decryptText(newMessage.text)
    });

    res.status(200).json({
        status: 'success',
        data: {
            newMessage
        }
    });
});

const getMessages = catchAsync(async (req, res, next) => {
    const { groupId } = req.params;

    const groupMessages = await Message.find({ groupId });

    if(!groupMessages){
        return next(new AppError('Incorrect group id!', 404));
    }

    const decryptText = groupMessages.map((m) => ({
        ...m.toObject(), text: Message.decryptText(m.text)
    }));

    res.status(200).json({
        status: 'success',
        message: 'returned messages successfully!',
        data: {
            groupMessages: decryptText
        }
    });
});

const getGroups = catchAsync(async (req, res, next) => {
    const groups = await Group.find({ members: req.user._id });

    res.status(200).json({
        status: 'success',
        message: 'Successfully returned groups!',
        data: {
            groups
        }
    });
});

module.exports = { sendMessage, getMessages, getGroups };