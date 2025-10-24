// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Bắt buộc phải có
    },
    email: {
        type: String,
        required: true,
        unique: true // Email không được trùng
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;