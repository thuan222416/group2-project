// src/components/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // <-- THÊM Link VÀO IMPORT

// LẤY ĐỊA CHỈ IP BACKEND
const BACKEND_URL = 'http://${process.env.REACT_APP_API_URL}:3000'; // <-- THAY IP CỦA BẠN

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook để chuyển trang

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setMessage(res.data.message);
            alert('Đăng nhập thành công!');
            // Chuyển hướng người dùng về trang chủ sau khi đăng nhập thành công
            navigate('/');
            window.location.reload(); // Tải lại để cập nhật navbar

        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Đăng Nhập</h2>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginLeft: '5px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ marginLeft: '5px', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit">Đăng Nhập</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* ---- THÊM LINK QUÊN MẬT KHẨU ---- */}
            <div style={{ marginTop: '15px' }}>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
            {/* ---------------------------------- */}

        </div>
    );
}
export default LoginPage;