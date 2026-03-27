const mongoose = require('mongoose');
const CryptoJs = require('crypto-js');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'text is required']
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    }
}, { timestamps: true });

messageSchema.statics.encryptText = (text) => {
    return CryptoJs.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

messageSchema.statics.decryptText = (encrypted) => {
    return CryptoJs.AES.decrypt(encrypted, process.env.ENCRYPTION_KEY).toString(CryptoJs.enc.Utf8);
};

const Message = mongoose.model('message', messageSchema);

module.exports = Message;