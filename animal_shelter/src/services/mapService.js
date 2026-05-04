import apiClient from './apiClient';

const mapService = {
  // Отримати всі локації (з можливістю фільтрації через params)
  getLocations: async (params = {}) => {
    try {
      const response = await apiClient.get('/map/locations', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Отримати конкретну локацію за ID
  getLocationById: async (id) => {
    try {
      const response = await apiClient.get(`/map/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Додати нову локацію (доступно для адмінів або через модерацію)
  addLocation: async (locationData) => {
    try {
      const response = await apiClient.post('/map/locations', locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Знайти найближчі притулки/клініки (геопошук)
  getNearbyShelters: async (lat, lng, radius = 10) => {
    try {
      const response = await apiClient.get('/map/nearby', { 
        params: { lat, lng, radius } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Оновити дані локації
  updateLocation: async (id, updateData) => {
    try {
      const response = await apiClient.put(`/map/locations/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Видалити локацію (тільки для адмінів)
  deleteLocation: async (id) => {
    try {
      const response = await apiClient.delete(`/map/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default mapService;