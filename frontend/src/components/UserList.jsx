// src/components/UserList.jsx
import React from 'react';

// Nhận thêm 2 hàm mới: handleDelete và handleEdit
function UserList({ users, handleDelete, handleEdit }) {
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}> {/* Dùng _id từ MongoDB */}
            {user.name} ({user.email})
            
            {/* THÊM 2 NÚT NÀY VÀO */}
            <button onClick={() => handleEdit(user)} style={{ marginLeft: '10px' }}>
              Sửa
            </button>
            <button onClick={() => handleDelete(user._id)} style={{ marginLeft: '5px' }}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;