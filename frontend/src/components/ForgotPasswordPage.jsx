// src/components/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link

// LẤY ĐỊA CHỈ IP BACKEND TỪ App.jsx HOẶC ĐỊNH NGHĨA Ở ĐÂY
const BACKEND_URL = 'http://192.168.1.12:3000'; // <-- THAY IP CỦA BẠN

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); // Thêm state cho lỗi

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset thông báo cũ
        setError('');   // Reset lỗi cũ
        try {
            // Gọi API /auth/forgot-password
            const res = await axios.post(`${BACKEND_URL}/auth/forgot-password`, { email });
            setMessage(res.data.message); // Hiển thị thông báo thành công
        } catch (err) {
            // Hiển thị lỗi từ backend (nếu có) hoặc lỗi chung
            setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            <h2>Quên Mật Khẩu</h2>
            <p>Nhập địa chỉ email của bạn để nhận link đặt lại mật khẩu.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginLeft: '5px', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit">Gửi Yêu Cầu</button>
            </form>
            {/* Hiển thị thông báo thành công hoặc lỗi */}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <br />
            <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
    );
}
export default ForgotPasswordPage;  