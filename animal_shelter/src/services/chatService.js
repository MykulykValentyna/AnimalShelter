import apiClient from './apiClient';

const chatService = {
  getChats: async () => {
    try {
      const response = await apiClient.get('/chats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getChatMessages: async (chatId) => {
    try {
      const response = await apiClient.get(`/chats/${chatId}/messages`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  sendMessage: async (chatId, text) => {
    try {
      const response = await apiClient.post(`/chats/${chatId}/messages`, { text });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  startNewChat: async (receiverId, initialMessage) => {
    try {
      const response = await apiClient.post('/chats', { 
        receiverId, 
        message: initialMessage 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAsRead: async (chatId) => {
    try {
      const response = await apiClient.patch(`/chats/${chatId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteChat: async (chatId) => {
    try {
      const response = await apiClient.delete(`/chats/${chatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default chatService;