// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// --------------------------------------------------
// SẮP XẾP LẠI THỨ TỰ
// --------------------------------------------------

// --- HOẠT ĐỘNG 2: ROUTE PROFILE (Phải đặt LÊN TRÊN) ---
// Các route "cụ thể" phải luôn đứng trước các route "động"

// GET /users/profile - Lấy thông tin cá nhân
router.get('/profile', protect, userController.getUserProfile);

// PUT /users/profile - Cập nhật thông tin cá nhân
router.put('/profile', protect, userController.updateUserProfile);


// --- Route CRUD cũ (từ Buổi 4) ---
// (Các route này sẽ được bảo vệ sau)

// GET /users
router.get('/', userController.getAllUsers);

// POST /users
router.post('/', userController.createUser);

// PUT /users/:id (Route này phải nằm SAU /profile)
router.put('/:id', userController.updateUser);

// DELETE /users/:id (Route này phải nằm SAU /profile)
router.delete('/:id', userController.deleteUser);
// --------------------------------------------------

module.exports = router;