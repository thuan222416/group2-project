// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// --- HOẠT ĐỘNG 4 ---
router.post('/forgot-password', authController.forgotPassword); // <-- DÒNG MỚI
// router.put('/reset-password/:token', authController.resetPassword); // (Sẽ thêm sau)
// -------------------

module.exports = router;