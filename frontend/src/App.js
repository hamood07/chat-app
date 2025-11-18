// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={<Login setToken={setToken} setUserId={setUserId} />}
      />
      <Route
        path="/register"
        element={<Register setToken={setToken} setUserId={setUserId} />}
      />
      <Route
        path="/chat"
        element={<Chat token={token} userId={userId} />}
      />
    </Routes>
  );
}

export default App;

