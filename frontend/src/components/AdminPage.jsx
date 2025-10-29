// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList'; // Tái sử dụng component UserList

const BACKEND_URL = process.env.REACT_APP_API_URL; // <-- THAY IP CỦA BẠN

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    // Hàm lấy Token
    const getToken = () => localStorage.getItem('token');

    // Hàm lấy danh sách user
    const fetchUsers = async () => {
        setMessage('');
        try {
            const token = getToken();
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            
            // Gọi API GET /users (đã được bảo vệ)
            const { data } = await axios.get(`${BACKEND_URL}/users`, config);
            setUsers(data);
        } catch (error) {
            setMessage(error.response.data.message || 'Có lỗi xảy ra');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm xử lý Xóa
    const handleDeleteUser = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa user này?')) {
            try {
                const token = getToken();
                const config = {
                    headers: { 'Authorization': `Bearer ${token}` }
                };
                
                // Gọi API DELETE /users/:id (đã được bảo vệ)
                await axios.delete(`${BACKEND_URL}/users/${id}`, config);
                alert('Xóa thành công!');
                fetchUsers(); // Tải lại danh sách
            } catch (error) {
                alert(error.response.data.message || 'Xóa thất bại');
            }
        }
    };

    return (
        <div>
            <h2>Trang Quản Trị: Quản Lý User</h2>
            {message && <p style={{ color: 'red' }}>{message}</p>}
            
            {/* Chúng ta tái sử dụng UserList nhưng truyền hàm xóa của Admin vào */}
            <UserList 
                users={users} 
                handleDelete={handleDeleteUser} 
                handleEdit={() => {}} // (Admin page không cần sửa, tạm để rỗng)
            />
        </div>
    );
}

export default AdminPage;