// routes/user.js

const express = require('express');
const router = express.Router();

// Import các hàm controller
const { getAllUsers, createUser } = require('../controllers/userController');

// Định nghĩa các routes
// Khi có request GET tới '/', nó sẽ gọi hàm getAllUsers
router.get('/', getAllUsers);

// Khi có request POST tới '/', nó sẽ gọi hàm createUser
router.post('/', createUser);

// Xuất router ra để sử dụng trong file chính
module.exports = router;