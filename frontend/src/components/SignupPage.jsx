import React, { useState } from 'react';
import axios from 'axios';

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Thay IP của SV1 vào đây
            const res = await axios.post('http://${process.env.REACT_APP_API_URL}/auth/signup', { name, email, password });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
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
            {message && <p>{message}</p>} {/* Hiển thị thông báo */}
        </div>
    );
}
export default SignupPage;