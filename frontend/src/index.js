// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App' // <-- Đổi tên import
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper /> {/* <-- Sử dụng AppWrapper */}
  </React.StrictMode>,
)