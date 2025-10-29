// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // ---- THÊM MỚI ----
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Chỉ cho phép 2 giá trị này
        default: 'user'         // Mặc định là 'user'
    }
    // --------------------
});

// ---- THÊM MỚI: Mã hóa mật khẩu TRƯỚC KHI LƯU ----
userSchema.pre('save', async function(next) {
    // Chỉ mã hóa nếu mật khẩu được thay đổi (hoặc là user mới)
    if (!this.isModified('password')) {
        return next();
    }

    // Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ---- THÊM MỚI: Method để so sánh mật khẩu khi đăng nhập ----
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;