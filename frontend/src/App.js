// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import các trang/component
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import EditForm from './components/EditForm';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage'; // <-- HOẠT ĐỘNG 2: IMPORT MỚI
import './App.css';

// ĐỊNH NGHĨA ĐỊA CHỈ IP Ở ĐÂY
const BACKEND_URL = 'http://172.16.15.193:3000'; // <-- Giữ nguyên IP của bạn

// -----------------------------------------------------------------
// Component Bảng điều khiển User (Trang chủ)
// -----------------------------------------------------------------
function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);

  const fetchUsers = () => {
    // SỬA LỖI: Bỏ tiền tố /api/
    axios.get(`${BACKEND_URL}/users`) 
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // SỬA LỖI: Bỏ tiền tố /api/
      axios.delete(`${BACKEND_URL}/users/${id}`)
        .then(() => {
          alert('User deleted!');
          fetchUsers();
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
  };

  return (
    <div>
      <h1>User Management (Trang chủ)</h1>
      {/* SỬA LỖI: Bỏ tiền tố /api/ */}
      <AddUser onUserAdded={fetchUsers} backendUrl={BACKEND_URL} /> 
      
      <EditForm 
        user={userToEdit} 
        fetchUsers={fetchUsers} 
        setUserToEdit={setUserToEdit} 
        backendUrl={BACKEND_URL} // SỬA LỖI: Bỏ tiền tố /api/
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

// -----------------------------------------------------------------
// HÀM APP() CHÍNH - DÙNG ĐỂ ĐIỀU HƯỚNG (ROUTING)
// -----------------------------------------------------------------
function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Bạn đã đăng xuất!');
    navigate('/login');
  };

  return (
    <div className="App">
      <nav style={{ padding: '10px', background: '#eee' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Trang chủ</Link>
        <Link to="/login" style={{ marginRight: '10px' }}>Đăng nhập</Link>
        <Link to="/signup" style={{ marginRight: '10px' }}>Đăng ký</Link>
        {/* HOẠT ĐỘNG 2: THÊM LINK MỚI */}
        <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link> 
        <button onClick={handleLogout} style={{ float: 'right' }}>Đăng xuất</button>
      </nav>

      <hr />

      {/* Định nghĩa các trang (routes) */}
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* HOẠT ĐỘNG 2: THÊM ROUTE MỚI */}
        <Route path="/profile" element={<ProfilePage />} /> 
      </Routes>
    </div>
  );
}

// Cần bọc App trong BrowserRouter
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;