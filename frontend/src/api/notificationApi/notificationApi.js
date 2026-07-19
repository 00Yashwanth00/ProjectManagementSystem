// frontend/src/api/notificationApi/notificationApi.js

import axiosInstance from '../axiosInstance';

/**
 * Get all notifications for the current user
 * @returns {Promise} - Axios response with list of notifications
 */
export const getNotifications = async () => {
  const response = await axiosInstance.get('/notifications');
  return response;
};

/**
 * Get unread notification count
 * @returns {Promise} - Axios response with unread count
 */
export const getUnreadCount = async () => {
  const response = await axiosInstance.get('/notifications/unread/count');
  return response;
};

/**
 * Get a single notification by ID
 * @param {string} notificationId - Notification UUID
 * @returns {Promise} - Axios response with notification details
 */
export const getNotification = async (notificationId) => {
  const response = await axiosInstance.get(`/notifications/${notificationId}`);
  return response;
};

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification UUID
 * @returns {Promise} - Axios response (204 No Content)
 */
export const markAsRead = async (notificationId) => {
  const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
  return response;
};

/**
 * Mark all notifications as read
 * @returns {Promise} - Axios response (204 No Content)
 */
export const markAllAsRead = async () => {
  const response = await axiosInstance.patch('/notifications/read-all');
  return response;
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification UUID
 * @returns {Promise} - Axios response (204 No Content)
 */
export const deleteNotification = async (notificationId) => {
  const response = await axiosInstance.delete(`/notifications/${notificationId}`);
  return response;
};

/**
 * Delete all notifications
 * @returns {Promise} - Axios response (204 No Content)
 */
export const deleteAllNotifications = async () => {
  const response = await axiosInstance.delete('/notifications');
  return response;
};