// src/components/EditForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component này nhận vào user đang được sửa và các hàm từ App.jsx
function EditForm({ user, fetchUsers, setUserToEdit }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Dùng useEffect để điền dữ liệu cũ vào form khi user thay đổi
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lấy địa chỉ IP của máy backend (thay cho localhost)
        const backendUrl = 'http://192.168.1.12:3000'; // <-- THAY ĐỊA CHỈ IP CỦA BẠN

        axios.put(`${backendUrl}/users/${user._id}`, { name, email })
            .then(() => {
                alert('User updated successfully!');
                fetchUsers(); // Tải lại danh sách user
                setUserToEdit(null); // Đóng form edit
            })
            .catch(error => console.error('Error updating user:', error));
    };

    if (!user) return null; // Nếu không có user nào đang edit, không hiển thị gì cả

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <h3>Editing User: {user.name}</h3>
            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setUserToEdit(null)}>Cancel</button>
        </form>
    );
}

export default EditForm;