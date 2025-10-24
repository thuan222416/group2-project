// server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// ✅ BẮT BUỘC: Dòng này phải ở đây, trước các routes
// Nó giúp server đọc và hiểu được body dạng JSON
app.use(cors());
app.use(express.json());

// Import route người dùng
const userRoutes = require('./routes/user');

// Gắn route vào ứng dụng
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});