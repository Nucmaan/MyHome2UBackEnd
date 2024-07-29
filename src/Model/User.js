const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
    
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address' ]
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: Number,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://www.shutterstock.com/image-photo/handsome-hispanic-millennial-man-sit-260nw-2174725871.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'agent'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
