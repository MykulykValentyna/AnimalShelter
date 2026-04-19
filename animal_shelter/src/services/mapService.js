import apiClient from './apiClient';

const mapService = {
  getLocations: async (params = {}) => {
    try {
      const response = await apiClient.get('/map/locations', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getLocationById: async (id) => {
    try {
      const response = await apiClient.get(`/map/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addLocation: async (locationData) => {
    try {
      const response = await apiClient.post('/map/locations', locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

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

  updateLocation: async (id, updateData) => {
    try {
      const response = await apiClient.put(`/map/locations/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

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