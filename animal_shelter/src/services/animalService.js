import apiClient from './apiClient';

const animalService = {
  getAllAnimals: async (params = {}) => {
    try {
      const response = await apiClient.get('/animals/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAnimalById: async (id) => {
    try {
      const response = await apiClient.get(`/animals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createAnimalListing: async (animalData) => {
    try {
      const response = await apiClient.post('/animals', animalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateAnimalStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/animals/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default animalService;