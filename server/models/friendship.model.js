const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    user1: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', required: true 
    },
    user2: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', required: true 
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    }
}, { timestamps: true });

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;