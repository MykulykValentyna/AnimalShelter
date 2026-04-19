import apiClient from './apiClient';

const authService = {
  verifyWithDiia: async (diiaData) => {
    try {
      const response = await apiClient.post('/auth/diia', diiaData);
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;