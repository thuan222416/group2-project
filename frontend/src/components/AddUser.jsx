// src/components/AddUser.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AddUser({ onUserAdded, backendUrl }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Cập nhật hàm handleSubmit để có validation
  const handleSubmit = async (event) => {
    event.preventDefault();

    // --- PHẦN VALIDATION BẮT ĐẦU ---
    // 1. Kiểm tra Tên (không được trống)
    if (!name.trim()) {
      alert("Tên không được để trống");
      return; // Dừng hàm, không gửi request
    }

    // 2. Kiểm tra Email (phải đúng định dạng)
    // Regex này kiểm tra định dạng email đơn giản: "chuoi@chuoi.chuoi"
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: test@gmail.com)");
      return; // Dừng hàm
    }
    // --- PHẦN VALIDATION KẾT THÚC ---

    // Nếu mọi thứ hợp lệ, tiếp tục gửi request
    const newUser = { name, email };

    try {
      await axios.post(`${backendUrl}/users`, newUser);
      
      alert('User added successfully!');
      onUserAdded(); // Tải lại danh sách
      setName('');   // Xóa form
      setEmail('');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h2>Add New User</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          // Chúng ta bỏ 'required' của HTML để dùng validation bằng JS
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // Bỏ 'required'
        />
      </div>
      <button type="submit">Add User</button>
    </form>
  );
}

export default AddUser;