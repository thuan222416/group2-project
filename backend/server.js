require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// ✅ BẮT BUỘC: Dòng này phải ở đây, trước các routes
// Nó giúp server đọc và hiểu được body dạng JSON
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/authRoutes'); // <-- THÊM MỚI

// --- CẤU HÌNH CLOUDINARY NGAY SAU DOTENV ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// -------------------------------------------

// Khai báo một đối tượng cấu hình CORS để cho phép mọi nguồn
const corsOptions = {
  // Dấu '*' cho phép bất kỳ domain nào gọi API
  origin: '*', 
  // Cho phép các phương thức cần thiết
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // Cho phép truyền các Header như Authorization (cần cho JWT)
  allowedHeaders: 'Content-Type,Authorization',
  // Cho phép truy cập thông tin cookie/session (nếu có)
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/users', userRoutes); // <-- GIỮ NGUYÊN
app.use('/auth', authRoutes);  // <-- SỬA LẠI: Bỏ /api

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
        // Start server only after DB connection is successful
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });