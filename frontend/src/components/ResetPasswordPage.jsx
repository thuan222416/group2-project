// src/components/ResetPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
// Import hook để lấy param từ URL và điều hướng
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://${process.env.REACT_APP_API_URL}:3000'; // <-- THAY IP CỦA BẠN

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Thêm xác nhận mật khẩu
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { token } = useParams(); // Lấy token từ URL (ví dụ: /reset-password/abc123xyz)
    const navigate = useNavigate(); // Hook để chuyển trang

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Kiểm tra mật khẩu khớp nhau
        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }

        try {
            // Gọi API /auth/reset-password/:token
            const res = await axios.put(`${BACKEND_URL}/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
            navigate('/login'); // Chuyển về trang đăng nhập
        } catch (err) {
            setError(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
        }
    };

    return (
        <div>
            <h2>Đặt Lại Mật Khẩu Mới</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mật khẩu mới:</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ marginLeft: '5px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ marginLeft: '5px', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit">Xác nhận</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
export default ResetPasswordPage;