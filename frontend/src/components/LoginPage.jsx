import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Thay IP của SV1 vào đây
            const res = await axios.post('http://172.16.15.193:3000/auth/login', { email, password });
            
            console.log("Phản hồi từ backend:", res.data);

            // LƯU TOKEN VÀO LOCAL STORAGE
            localStorage.setItem('token', res.data.token);
            
            setMessage(res.data.message);
            // (Sau này bạn sẽ chuyển hướng người dùng sang trang profile)
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Đăng Nhập</h2>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Đăng Nhập</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
export default LoginPage;