// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Lấy token từ header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Tách token ra (loại bỏ 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Lấy thông tin user (trừ mật khẩu) và gắn vào req
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép đi tiếp
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// ---- THÊM MỚI (HOẠT ĐỘNG 3) ----
// Middleware "admin" (kiểm tra quyền Admin)
// LƯU Ý: Middleware này phải luôn chạy SAU middleware 'protect'
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Nếu là admin, cho đi tiếp
    } else {
        res.status(401).json({ message: 'Không có quyền truy cập (Không phải Admin)' });
    }
};
// ------------------------------

module.exports = { protect, admin };