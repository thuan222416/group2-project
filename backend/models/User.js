// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Cần cho Hoạt động 1

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
    // ---- THÊM TỪ HOẠT ĐỘNG 1 ----
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // ----------------------------

    // ---- THÊM MỚI (HOẠT ĐỘNG 4) ----
    avatar: {
        type: String,
        default: 'https://i.imgur.com/6VBx3io.png' // Link ảnh avatar mặc định
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
    // ------------------------------
});

// ---- LOGIC TỪ HOẠT ĐỘNG 1 (Mã hóa mật khẩu) ----
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ---- LOGIC TỪ HOẠT ĐỘNG 1 (So sánh mật khẩu) ----
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
// -------------------------------------------------

const User = mongoose.model('User', userSchema);

module.exports = User;