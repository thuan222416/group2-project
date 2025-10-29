// models/User.js
// PHIÊN BẢN HOÀN CHỈNH (ĐÃ GỘP HĐ1 VÀ HĐ4)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

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
    // --- Từ Hoạt động 1 (có trên 'main') ---
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // ------------------------------------

    // --- Từ Hoạt động 4 (có trên 'database-advanced') ---
    avatar: {
        type: String,
        default: 'https://i.imgur.com/6VBx3io.png' 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
    // --------------------------------------------------
});

// --- Logic từ Hoạt động 1 (có trên 'main') ---
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
// ---------------------------------------------

const User = mongoose.model('User', userSchema);

module.exports = User;