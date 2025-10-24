// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import EditForm from './components/EditForm'; // <-- Import component mới
import './App.css';

// ĐỊNH NGHĨA ĐỊA CHỈ IP Ở ĐÂY
const BACKEND_URL = 'http://192.168.1.9:3000'; // <-- THAY ĐỊA CHỈ IP CỦA BẠN

function App() {
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null); // <-- State mới để biết đang sửa ai

  const fetchUsers = () => {
    axios.get(`${BACKEND_URL}/users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // HÀM XỬ LÝ XÓA
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`${BACKEND_URL}/users/${id}`)
        .then(() => {
          alert('User deleted!');
          // Tải lại danh sách user sau khi xóa
          fetchUsers();
          // Hoặc cập nhật state local (cách 2):
          // setUsers(users.filter(user => user._id !== id));
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  // HÀM XỬ LÝ SỬA (chỉ cần set state)
  const handleEdit = (user) => {
    setUserToEdit(user);
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      <AddUser onUserAdded={fetchUsers} backendUrl={BACKEND_URL} />
      
      {/* Hiển thị form Sửa nếu có user đang được chọn */}
      <EditForm 
        user={userToEdit} 
        fetchUsers={fetchUsers} 
        setUserToEdit={setUserToEdit} 
      />

      <hr />
      <UserList 
        users={users} 
        handleDelete={handleDelete} 
        handleEdit={handleEdit} 
      />
    </div>
  );
}

export default App;