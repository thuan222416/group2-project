// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// Import cả 'admin'
const { protect, admin } = require('../middleware/authMiddleware');

// --- Route Profile (Từ HĐ 2) ---
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);

// --- HOẠT ĐỘNG 3: BẢO VỆ ROUTE ADMIN ---

// GET /users (Chỉ Admin được xem)
// Chúng ta áp dụng cả 2 middleware: 
// 1. 'protect' (để kiểm tra đăng nhập)
// 2. 'admin' (để kiểm tra vai trò)
router.get('/', protect, admin, userController.getAllUsers);

// POST /users (Bỏ qua, chúng ta đã có /auth/signup)
// router.post('/', userController.createUser); // (Có thể xóa hoặc bỏ qua route này)

// PUT /users/:id (Cũng nên là Admin)
router.put('/:id', protect, admin, userController.updateUser);

// DELETE /users/:id (Chỉ Admin được xóa)
router.delete('/:id', protect, admin, userController.deleteUser);
// ------------------------------------

module.exports = router;