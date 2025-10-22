// controllers/userController.js

// 1. Tạo một mảng tạm để làm cơ sở dữ liệu giả
let users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
];

// 2. Hàm để lấy tất cả người dùng (GET /users)
const getAllUsers = (req, res) => {
    res.status(200).json(users);
};

// 3. Hàm để tạo một người dùng mới (POST /users)
const createUser = (req, res) => {
    // Lấy dữ liệu người dùng mới từ body của request
    const newUser = req.body;

    // Tạo một ID đơn giản cho người dùng mới
    newUser.id = users.length + 1;

    // Thêm người dùng mới vào mảng
    users.push(newUser);

    // Trả về người dùng vừa tạo với status code 201 (Created)
    res.status(201).json(newUser);
};

// 4. Xuất các hàm này ra để có thể sử dụng ở file khác
module.exports = {
    getAllUsers,
    createUser
};