// controllers/userController.js
const User = require('../models/User');

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE one or more users
const createUser = async (req, res) => {
    try {
        const input = req.body;
        const result = Array.isArray(input) ? await User.insertMany(input) : await User.create(input);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --------------------------------------------------
// HOẠT ĐỘNG 7 BẮT ĐẦU TỪ ĐÂY
// --------------------------------------------------

// UPDATE a user by ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL
        const updatedUser = await User.findByIdAndUpdate(
            id,       // ID của user cần cập nhật
            req.body, // Dữ liệu mới (ví dụ: { name: "Tên Mới" })
            { new: true } // Tùy chọn này để trả về user sau khi đã cập nhật
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- HOẠT ĐỘNG 2: THÊM HÀM PROFILE ---

// @desc    Lấy thông tin profile của user đã đăng nhập
// @route   GET /users/profile
const getUserProfile = async (req, res) => {
    // req.user được gắn vào bởi middleware 'protect'
    const user = req.user; 
    
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Cập nhật thông tin profile của user
// @route   PUT /users/profile
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Nếu user có đổi mật khẩu
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Mật khẩu sẽ tự động được băm (hash) nhờ hook 'pre.save' trong Model
        const updatedUser = await user.save(); 

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            message: 'Cập nhật thành công'
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser, // <-- Thêm vào export
    deleteUser,  // <-- Thêm vào export
    getUserProfile,     // <-- THÊM MỚI
    updateUserProfile   // <-- THÊM MỚI
};