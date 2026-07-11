import axiosInstance from '../axiosInstance';

/**
 * Login user
 */
export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  });
  return response;
};

/**
 * Register user - ADMIN only
 * Creates user with EMPLOYEE role by default
 */
export const register = async (userData) => {
  // ✅ No role field - backend assigns EMPLOYEE by default
  const response = await axiosInstance.post('/auth/register', userData);
  return response;
};