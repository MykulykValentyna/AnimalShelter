import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Поки перевіряємо авторизацію, нічого не показуємо
  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Завантаження...</div>;
  }

  // Якщо користувач НЕ залогінений або його роль НЕ 'admin', кидаємо його на головну сторінку
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Якщо це справжній адмін, дозволяємо побачити сторінку
  return children;
};

export default AdminRoute;