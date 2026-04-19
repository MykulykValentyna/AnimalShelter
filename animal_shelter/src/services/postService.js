import apiClient from './apiClient';

const postService = {
  getPosts: async (type = 'all') => {
    try {
      const response = await apiClient.get('/posts', { params: { type } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPostById: async (id) => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getComments: async (postId) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addComment: async (postId, commentData) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  approvePost: async (postId) => {
    try {
      const response = await apiClient.put(`/admin/posts/${postId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default postService;