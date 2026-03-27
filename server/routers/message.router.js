const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { sendMessage, getMessages, getGroups } = require('../controllers/message.controller');

const messageRouter = express.Router();

messageRouter.post('/:groupId', protect, sendMessage);
messageRouter.get('/:groupId', protect, getMessages);
messageRouter.get('/groups', protect, getGroups);

module.exports = messageRouter;