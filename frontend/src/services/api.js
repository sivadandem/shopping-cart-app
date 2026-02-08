// src/services/api.js

import axios from 'axios';

// Hardcode API URL for production
const API_URL = 'https://shopping-cart-app-lkbh.onrender.com';

console.log('API URL:', API_URL);

// Create axios instance
const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('API Error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => API.post('/users', data),
    login: (data) => API.post('/users/login', data),
    logout: () => API.post('/users/logout')
};

// Items APIs
export const itemsAPI = {
    getAll: () => API.get('/items')
};

// Cart APIs
export const cartAPI = {
    getMyCart: () => API.get('/carts/my-cart'),
    addItem: (itemId) => API.post('/carts', { itemId }),
    removeItem: (itemId) => API.delete(`/carts/my-cart/items/${itemId}`)
};

// Orders APIs
export const ordersAPI = {
    create: () => API.post('/orders'),
    getMyOrders: () => API.get('/orders/my-orders')
};

export default API;