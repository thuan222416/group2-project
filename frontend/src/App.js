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
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage'; 
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

import './App.css';

// ĐỊNH NGHĨA ĐỊA CHỈ IP Ở ĐÂY
const BACKEND_URL = 'http://${process.env.REACT_APP_API_URL}:3000'; // <-- Giữ nguyên IP của bạn

// -----------------------------------------------------------------
// Component Bảng điều khiển User (Trang chủ)
// (Giữ nguyên, không thay đổi)
// -----------------------------------------------------------------
function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);

  const fetchUsers = () => {
    // Code này vẫn gọi GET /users
    // Sang Hoạt động 3, nó sẽ bị 'protect' và 'admin' chặn
    // Chỉ Admin đăng nhập mới xem được
    axios.get(`${BACKEND_URL}/users`) 
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        // Sau HĐ3, user thường sẽ thấy lỗi 401 ở đây
        // Chúng ta sẽ xử lý lỗi này sau
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // API này giờ cũng chỉ dành cho Admin
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
      <AddUser onUserAdded={fetchUsers} backendUrl={BACKEND_URL} /> 
      
      <EditForm 
        user={userToEdit} 
        fetchUsers={fetchUsers} 
        setUserToEdit={setUserToEdit} 
        backendUrl={BACKEND_URL}
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
  
  // Lấy thông tin user từ local storage
  const userInfo = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Dòng này đã có, rất tốt!
    alert('Bạn đã đăng xuất!');
    navigate('/login');
    window.location.reload(); // Tải lại trang để cập nhật nav
  };

  return (
    <div className="App">
      <nav style={{ padding: '10px', background: '#eee' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Trang chủ</Link>
        <Link to="/login" style={{ marginRight: '10px' }}>Đăng nhập</Link>
        <Link to="/signup" style={{ marginRight: '10px' }}>Đăng ký</Link>
        <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link> 

        {/* ---- HOẠT ĐỘNG 3: THÊM LINK ADMIN CÓ ĐIỀU KIỆN ---- */}
        {userInfo && userInfo.role === 'admin' && (
            <Link to="/admin" style={{ marginRight: '10px', color: 'red', fontWeight: 'bold' }}>
                Admin
            </Link>
        )}
        {/* ------------------------------------------------- */}

        <button onClick={handleLogout} style={{ float: 'right' }}>Đăng xuất</button>
      </nav>

      <hr />

      {/* Định nghĩa các trang (routes) */}
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* ---- HOẠT ĐỘNG 3: THÊM ROUTE MỚI ---- */}
        <Route path="/admin" element={<AdminPage />} /> 
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> {/* Route có param :token */}
      </Routes>
    </div>
  );
}

// Cần bọc App trong BrowserRouter (Giữ nguyên)
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;