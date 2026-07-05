import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - Handle global errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('jwtToken');
      // You can add redirect logic here later
      // window.location.href = '/login';
    }
    
    // Handle 403 Forbidden
    if (error.response && error.response.status === 403) {
      console.error('Access denied. You do not have permission.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;