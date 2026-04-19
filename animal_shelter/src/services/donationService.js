import apiClient from './apiClient';

const donationService = {
  processOneTimeDonate: async (donationData) => {
    try {
      const response = await apiClient.post('/donations/one-time', donationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createSubscription: async (subscriptionData) => {
    try {
      const response = await apiClient.post('/donations/subscribe', subscriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getDonationHistory: async () => {
    try {
      const response = await apiClient.get('/donations/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await apiClient.delete(`/donations/subscribe/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getShelterFinancialStats: async (shelterId) => {
    try {
      const response = await apiClient.get(`/donations/stats/${shelterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default donationService;