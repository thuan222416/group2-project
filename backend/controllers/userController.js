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

module.exports = {
    getAllUsers,
    createUser,
    updateUser, // <-- Thêm vào export
    deleteUser  // <-- Thêm vào export
};