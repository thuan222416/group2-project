// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); // <-- THÊM MỚI
const crypto = require('crypto'); // <-- THÊM MỚI (Thư viện tạo token)

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

// --- HOẠT ĐỘNG 4: QUÊN MẬT KHẨU ---
exports.forgotPassword = async (req, res) => {
    try {
        // 1. Tìm user bằng email gửi lên
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Quan trọng: Không nên báo "Không tìm thấy user" vì lý do bảo mật.
            // Chỉ cần báo đã gửi (dù có gửi hay không).
            console.log(`Attempt to reset password for non-existent email: ${req.body.email}`);
            return res.status(200).json({ success: true, message: 'Nếu email tồn tại, bạn sẽ nhận được link reset.' });
        }

        // 2. Tạo token reset gốc (raw token)
        const resetToken = crypto.randomBytes(20).toString('hex');

// 3. Mã hóa token này
const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

// 4. Đặt thời gian hết hạn
const expireDate = Date.now() + 10 * 60 * 1000; // 10 phút

// 5. Cập nhật trực tiếp vào DB, chỉ 2 trường này
await User.findByIdAndUpdate(user._id, {
    resetPasswordToken: hashedToken,
    resetPasswordExpire: expireDate
});

        // 6. Tạo URL Reset (để gửi cho người dùng)
        // URL này sẽ trỏ đến trang Reset Password của frontend
        // (Hiện tại chúng ta chưa có trang này, tạm để placeholder)
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; 
        // Lưu ý: Gửi token gốc (resetToken), không phải token đã mã hóa!

        const message = `Bạn nhận được email này vì đã yêu cầu reset mật khẩu. Vui lòng nhấn vào link sau để đặt lại mật khẩu (link hết hạn sau 10 phút):\n\n${resetUrl}`;

        // 7. Gửi Email (hoặc log ra console để test)
        console.log("-----------------------------------------");
        console.log("!!! TOKEN RESET (Gửi cho SV3 test):", resetToken);
        console.log("-----------------------------------------");

        try {
            await sendEmail({
                email: user.email,
                subject: 'Yêu cầu Reset Mật khẩu',
                message,
            });
             res.status(200).json({ success: true, message: 'Email reset đã được gửi' });
        } catch (emailError) {
             console.error("Lỗi gửi email:", emailError);
             // Ngay cả khi gửi mail lỗi, vẫn không nên báo cho user biết là email có tồn tại hay không
             // Xóa token đã tạo để tránh lỗi DB
             user.resetPasswordToken = undefined;
             user.resetPasswordExpire = undefined;
             await user.save();
             res.status(500).json({ message: 'Lỗi khi gửi email. Vui lòng thử lại sau.' });
        }
        
        // Tạm thời chỉ log token ra console
        //res.status(200).json({ success: true, message: 'Yêu cầu đã được xử lý. Vui lòng kiểm tra console backend để lấy token reset.' });

    } catch (error) {
        console.error("Lỗi forgotPassword:", error);
        // Xử lý lỗi chung chung, tránh lộ thông tin
        res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
    }
};

// --- HOẠT ĐỘNG 4: RESET MẬT KHẨU ---
exports.resetPassword = async (req, res) => {
    try {
        // 1. Get the hashed token from URL parameter
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token) // Hash the raw token from the URL
            .digest('hex');

        // 2. Find user by the hashed token and check expiry date
        const user = await User.findOne({
            resetPasswordToken, // Find using the hashed token stored in DB
            resetPasswordExpire: { $gt: Date.now() }, // Check if expiry date is still in the future
        });

        // 3. If token is invalid or expired
        if (!user) {
            return res.status(400).json({ message: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
        }

        // 4. Set the new password
        user.password = req.body.password;

        // 5. Clear the reset token fields (so it can't be used again)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // 6. Save the user (password will be automatically hashed by pre-save hook)
        await user.save();

        // (Optional: Generate a new login token immediately if needed)
        // const token = generateToken(user._id, user.role);

        res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' });

    } catch (error) {
        console.error("Lỗi resetPassword:", error);
        res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
    }
};

// Cập nhật module.exports để thêm hàm mới
module.exports = {
    signup: exports.signup,
    login: exports.login,
    logout: exports.logout,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword
};