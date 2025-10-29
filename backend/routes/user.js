// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer'); // <-- HOẠT ĐỘNG 4: Import Multer

// --- Cấu hình Multer (HOẠT ĐỘNG 4) ---
// Lưu file vào bộ nhớ (tốt cho file nhỏ như avatar)
const storage = multer.memoryStorage();
// (Tùy chọn) Chỉ cho phép upload file ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        // Báo lỗi nếu không phải file ảnh
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};
// Tạo middleware upload
const upload = multer({ storage: storage, fileFilter: fileFilter });
// ------------------------------------

// --- Route Profile (Từ HĐ 2 & HĐ 4) ---
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);

// HOẠT ĐỘNG 4: API UPLOAD AVATAR
// Yêu cầu đăng nhập (protect) và xử lý file tên 'avatar' (upload.single)
router.put('/profile/avatar', protect, upload.single('avatar'), userController.uploadAvatar);
// ------------------------------------

// --- Route Admin (Từ HĐ 3) ---
router.get('/', protect, admin, userController.getAllUsers);
router.put('/:id', protect, admin, userController.updateUser); // Sửa thông tin user bất kỳ (Admin)
router.delete('/:id', protect, admin, userController.deleteUser); // Xóa user bất kỳ (Admin)

module.exports = router;