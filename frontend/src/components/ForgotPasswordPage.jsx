// src/components/ForgotPasswordPage.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import axios from 'axios';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_API_URL; // <-- THAY IP CỦA BẠN

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); // For backend response
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState(false); // <-- STATE MỚI CHO THÀNH CÔNG

    // Clear success message after 3 seconds
    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => {
                setSuccess(false);
            }, 3000); // 3 giây
        }
        return () => clearTimeout(timer); // Cleanup timer on component unmount or if success changes
    }, [success]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setSuccess(false); // Reset success state on new submit
        setIsSending(true);

        try {
            const res = await axios.post(`${BACKEND_URL}/auth/forgot-password`, { email });
            setMessage(res.data.message); // Lưu thông báo từ backend
            setSuccess(true);           // <-- ĐẶT LÀ TRUE KHI THÀNH CÔNG
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setIsSending(false);
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
                        disabled={isSending}
                    />
                </div>
                <button type="submit" disabled={isSending}>
                    {isSending ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                </button>
            </form>

            {/* Hiển thị trạng thái */}
            {isSending && <p style={{ color: 'orange' }}>Đang xử lý yêu cầu...</p>}
            {success && <p style={{ color: 'green' }}>✔ Yêu cầu đã được gửi thành công!</p>}
            {message && !success && <p style={{ color: 'blue' }}>{message}</p>} {/* Chỉ hiện message backend nếu không phải success */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <br />
            <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
    );
}
export default ForgotPasswordPage;