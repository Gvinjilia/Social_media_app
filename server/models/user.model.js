const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique']
    },
    photo: String,
    role: {
        enum: ['user', 'admin', 'moderator'],
        default: 'user',
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    }
}, { timestamps: true });

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePasswords = async (candidate, password) => {
    return await bcrypt.compare(candidate, password);
};

userSchema.methods.createVerificationCode = function(){
    const code = crypto.randomBytes(12).toString('hex');

    this.verificationCode = code;

    return code;
};

const User = mongoose.model("user", userSchema);

module.exports = User;