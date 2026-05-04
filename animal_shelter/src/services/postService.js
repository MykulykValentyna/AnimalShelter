import apiClient from './apiClient';

const postService = {
  // 1. Отримати всі схвалені пости (для головної стрічки)
  getPosts: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 2. Отримати пости конкретного авторизованого користувача (для сторінки профілю)
  getUserPosts: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 3. Створення нового поста (йде на модерацію)
  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 4. Видалення власного акаунту (і всіх пов'язаних даних через CASCADE)
  deleteAccount: async () => {
    try {
      const response = await apiClient.delete('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 5. Отримати деталі поста (якщо потрібна окрема сторінка)
  getPostById: async (id) => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// ==========================================
// СЕРВІС ДЛЯ АДМІН-ПАНЕЛІ
// ==========================================

export const adminService = {
  // Отримати чергу постів на модерацію
  getPendingPosts: async () => {
    try {
      const response = await apiClient.get('/admin/posts/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Схвалити пост (статус змінить на published)
  approvePost: async (postId) => {
    try {
      const response = await apiClient.put(`/admin/posts/${postId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Відхилити пост (статус змінить на rejected + додасть коментар)
  rejectPost: async (postId, reason) => {
    try {
      // Зверни увагу: бекенд очікує поле "adminComment"
      const response = await apiClient.put(`/admin/posts/${postId}/reject`, { adminComment: reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Змінити роль іншому користувачу (зробити адміном або повернути статус юзера)
  setRole: async (userId, newRole) => {
    try {
      const response = await apiClient.put('/admin/users/set-role', { userId, newRole });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default postService;