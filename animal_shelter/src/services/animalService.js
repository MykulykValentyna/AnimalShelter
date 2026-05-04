import apiClient from './apiClient';

const animalService = {
  // Отримати список тварин (фільтрація, пошук)
  getAllAnimals: async (params = {}) => {
    try {
      const response = await apiClient.get('/animals', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Отримати детальну інформацію про конкретну тваринку
  getAnimalById: async (id) => {
    try {
      const response = await apiClient.get(`/animals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Створення поста про тварину (відправка на модерацію)
  createAnimalListing: async (animalData) => {
    try {
      // animalData має містити: name, type, breed, location, description та photo (base64 або FormData)
      const response = await apiClient.post('/animals', animalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Оновлення статусу (для адмін-панелі: 'approved', 'rejected')
  updateAnimalStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/animals/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Видалити анкету тварини
  deleteAnimal: async (id) => {
    try {
      const response = await apiClient.delete(`/animals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default animalService;