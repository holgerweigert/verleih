import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hier deine Backend-URL eintragen
const API_BASE_URL = 'https://verleih.kirschenholz.de/api';

// Axios Instance erstellen
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor für Auth Token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor für Error Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token abgelaufen, logout
      await AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// API Service Funktionen
export const apiService = {
  // Auth
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem('authToken');
  },

  // Kunden
  async getCustomers(searchTerm = '') {
    const response = await api.get('/customers', {
      params: searchTerm ? { search: searchTerm } : {},
    });
    return response.data;
  },

  async getCustomer(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(customerData) {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  async updateCustomer(id, customerData) {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  async deleteCustomer(id) {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  // Produkte
  async getProducts() {
    const response = await api.get('/products');
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Verleihungen
  async getRentals(status = 'active') {
    const response = await api.get('/rentals', {
      params: { status },
    });
    return response.data;
  },

  async getRental(id) {
    const response = await api.get(`/rentals/${id}`);
    return response.data;
  },

  async createRental(rentalData) {
    const response = await api.post('/rentals', rentalData);
    return response.data;
  },

  async updateRental(id, rentalData) {
    const response = await api.put(`/rentals/${id}`, rentalData);
    return response.data;
  },

  async returnRental(id, returnData) {
    const response = await api.post(`/rentals/${id}/return`, returnData);
    return response.data;
  },

  // Quittungen
  async getReceipt(rentalId) {
    const response = await api.get(`/rentals/${rentalId}/receipt`);
    return response.data;
  },

  async getReceipts() {
    const response = await api.get('/receipts');
    return response.data;
  },

  // Statistiken
  async getStats() {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default api;
