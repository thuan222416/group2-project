// controllers/userController.js
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

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

// --- HOẠT ĐỘNG 4: UPLOAD AVATAR ---
const uploadAvatar = async (req, res) => {
    try {
        // 1. Check if file exists (Multer puts the file in req.file)
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn một file ảnh để tải lên.' });
        }

        // 2. Convert buffer to base64 Data URI for Cloudinary
        // Multer's memoryStorage gives us the file as a buffer
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // 3. Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "group2-project-avatars", // Optional: Organize uploads in a folder
            // You can add transformations here (e.g., crop, resize)
            // transformation: [{ width: 150, height: 150, crop: "fill" }]
        });

        // 4. Update user's avatar URL in the database
        // We get the user ID from the 'protect' middleware (req.user)
        const user = await User.findById(req.user.id);
        if (!user) {
            // This should rarely happen if 'protect' middleware works
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        user.avatar = result.secure_url; // Use the secure HTTPS URL
        await user.save();

        // 5. Send success response
        res.status(200).json({
            message: 'Tải lên avatar thành công!',
            avatarUrl: result.secure_url,
        });

    } catch (error) {
        console.error("Lỗi upload avatar:", error);
        // Provide more specific error messages if possible
        if (error.message.includes("File size too large")) {
             return res.status(400).json({ message: 'Kích thước file quá lớn.' });
        }
        res.status(500).json({ message: 'Đã xảy ra lỗi server khi tải lên ảnh.' });
    }
};

module.exports = {
    getAllUsers, // Chỉ cần ghi tên
    createUser,
    updateUser,
    deleteUser,
    getUserProfile,
    updateUserProfile,
    uploadAvatar // Ghi tên hàm bạn vừa định nghĩa ở trên
};