import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiClient.get('/users/me');
          setCurrentUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (loginData, password) => {
    try {
      const response = await apiClient.post('/auth/login', { login: loginData, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Невірний логін або пароль' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      // Одразу логінимо після реєстрації, щоб не викидало
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        return { success: true };
      }
      return { success: true }; 
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Помилка реєстрації' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);