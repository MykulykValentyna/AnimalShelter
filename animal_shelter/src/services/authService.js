import apiClient from './apiClient';

const authService = {
  // Класичний логін
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Класична реєстрація
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Авторизація через Дію (як ми імітували раніше)
  verifyWithDiia: async (diiaData) => {
    try {
      const response = await apiClient.post('/auth/diia', diiaData);
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Отримання актуальних даних користувача з БД
  getCurrentUser: async () => {
    try {
      // ВИПРАВЛЕНО: Змінено /auth/me на /users/me (відповідно до твого бекенду)
      const response = await apiClient.get('/users/me');
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  // Вихід з акаунту
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  },

  // Швидка перевірка наявності токена для роутів
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Видалення акаунту
  deleteAccount: async () => {
    try {
      const response = await apiClient.delete('/users/me'); 
      if (response.data.success) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default authService;