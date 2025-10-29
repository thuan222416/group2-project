
// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Lấy IP Backend (giả sử bạn định nghĩa ở file khác, hoặc hardcode)
const BACKEND_URL = 'http://172.16.15.193:3000'; // <-- THAY IP CỦA BẠN

function ProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Hàm lấy thông tin profile
    const fetchProfile = async () => {
        try {
            // 1. Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Vui lòng đăng nhập');
                return;
            }

            // 2. Tạo config cho header
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Gửi token
                }
            };

            // 3. Gọi API GET /users/profile
            const { data } = await axios.get(`${BACKEND_URL}/users/profile`, config);

            // 4. Điền thông tin vào form
            setName(data.name);
            setEmail(data.email);

        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    // Tự động gọi hàm fetchProfile khi trang được tải
    useEffect(() => {
        fetchProfile();
    }, []);

    // Hàm xử lý cập nhật (Submit Form)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            // Tạo body, chỉ gửi password nếu nó không rỗng
            const body = { name, email };
            if (password) {
                body.password = password;
            }

            // Gọi API PUT /users/profile
            const { data } = await axios.put(`${BACKEND_URL}/users/profile`, body, config);
            
            setMessage(data.message || 'Cập nhật thành công!');
            setPassword(''); // Xóa ô password sau khi submit

        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Thông tin cá nhân</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Tên" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Đổi mật khẩu (bỏ trống nếu không đổi)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Cập nhật</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ProfilePage;