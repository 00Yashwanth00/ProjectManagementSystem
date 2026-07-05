import axiosInstance from '../axiosInstance';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Axios response with token
 */
export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  });
  return response;
};

/**
 * Register user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.role - User role (ADMIN, PROJECT_LEADER, TEAM_MEMBER)
 * @returns {Promise} - Axios response
 */
export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response;
};