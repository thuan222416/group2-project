// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Tạo transporter (người vận chuyển)
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Hoặc dùng host, port nếu không phải Gmail
        auth: {
            user: process.env.EMAIL_USER, // Lấy từ file .env
            pass: process.env.EMAIL_PASS, // Lấy từ file .env
        },
    });

    // 2. Định nghĩa các tùy chọn email
    const mailOptions = {
        from: `Group 2 Project <${process.env.EMAIL_USER}>`, // Tên người gửi
        to: options.email, // Địa chỉ người nhận
        subject: options.subject, // Tiêu đề email
        text: options.message, // Nội dung email (dạng text)
        // html: options.html // Bạn có thể dùng HTML nếu muốn
    };

    // 3. Gửi email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        // Bạn nên xử lý lỗi này cẩn thận hơn trong ứng dụng thực tế
    }
};

module.exports = sendEmail;