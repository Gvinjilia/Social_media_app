const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, { timestamps: true });

const Group = mongoose.model('group', groupSchema);

module.exports = Group;