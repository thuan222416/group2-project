// src/components/SignupPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để chuyển hướng

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Lấy URL từ biến môi trường
        const backendUrl = process.env.REACT_APP_API_URL; // Cú pháp Create React App

        try {
            // SỬA LỖI Ở ĐÂY: Dùng dấu backtick (`) để kết hợp chuỗi
            const res = await axios.post(`${backendUrl}/auth/signup`, { name, email, password });
            
            setMessage(res.data.message);
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login'); // Chuyển hướng về trang đăng nhập
            
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Lỗi kết nối.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Đăng Ký</h2>
                <input type="text" placeholder="Tên" onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Đăng Ký</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
export default SignupPage;