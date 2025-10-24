// src/components/AddUser.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Nhận props từ App.jsx (bao gồm backendUrl và hàm onUserAdded)
function AddUser({ onUserAdded, backendUrl }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newUser = { name, email };

    // Sử dụng 'backendUrl' đã được truyền từ App.jsx
    axios.post(`${backendUrl}/users`, newUser)
      .then(() => {
        alert('User added successfully!');
        
        // Gọi hàm của App.jsx để tải lại danh sách
        onUserAdded(); 
        
        // Xóa trống các ô input
        setName('');
        setEmail('');
      })
      .catch(error => console.error('Error adding user:', error));
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
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add User</button>
    </form>
  );
}

export default AddUser;