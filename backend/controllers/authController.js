// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hàm tạo token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token hết hạn sau 1 giờ
    });
};

// 1. Đăng ký (Sign Up)
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra email trùng
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Tạo user mới (password sẽ tự động được băm bởi hook của SV3)
        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({ message: 'Đăng ký thành công', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Đăng nhập (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // So sánh mật khẩu (dùng method của SV3)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Tạo và trả về token
        const token = generateToken(user._id, user.role);
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: { name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Đăng xuất (Logout)
exports.logout = (req, res) => {
    // Đối với JWT, logout chủ yếu là phía client xóa token.
    // Backend có thể không cần làm gì, hoặc làm phức tạp (blacklist token).
    // Tạm thời, chúng ta chỉ cần trả về thông báo thành công.
    res.status(200).json({ message: 'Đăng xuất thành công' });
};