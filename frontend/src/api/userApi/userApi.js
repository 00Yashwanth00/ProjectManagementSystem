import axiosInstance from '../axiosInstance';

/**
 * Get all users
 * @returns {Promise} - Axios response with list of users
 */
export const getAllUsers = async () => {
//   console.log('Fetching all users...');
  const response = await axiosInstance.get('/users');
  console.log('Fetched users:', response.data);
  return response;
};

/**
 * Get user by ID
 * @param {string} userId - User UUID
 * @returns {Promise} - Axios response with user details
 */
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response;
};

/**
 * Get current user's profile
 * @returns {Promise} - Axios response with current user details
 */
export const getCurrentUser = async () => {
  // Assuming your backend has a /users/me endpoint
  // If not, use the token to get user info
  const response = await axiosInstance.get('/users/me');
  return response;
};