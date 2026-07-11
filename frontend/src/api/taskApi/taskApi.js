import axiosInstance from '../axiosInstance';

/**
 * Get all tasks for a project
 * @param {string} projectId - Project UUID
 * @returns {Promise} - Axios response with list of tasks
 */
export const getTasksByProject = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/tasks`);
  return response;
};

/**
 * Create a new task in a project
 * @param {string} projectId - Project UUID
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title
 * @param {string} taskData.description - Task description
 * @param {string} taskData.priority - Task priority (HIGH, MEDIUM, LOW)
 * @param {string} taskData.assigneeId - User UUID to assign (optional)
 * @returns {Promise} - Axios response with created task
 */
export const createTask = async (projectId, taskData) => {
  const response = await axiosInstance.post(`/projects/${projectId}/tasks`, taskData);
  return response;
};

/**
 * Assign a task to a user
 * @param {string} taskId - Task UUID
 * @param {string} userId - User UUID to assign
 * @returns {Promise} - Axios response
 */
export const assignTask = async (taskId, userId) => {
  const response = await axiosInstance.post(`/tasks/${taskId}/assign/${userId}`);
  return response;
};

/**
 * Update task status
 * @param {string} taskId - Task UUID
 * @param {string} status - New status (TODO, IN_PROGRESS, DONE)
 * @returns {Promise} - Axios response
 */
export const updateTaskStatus = async (taskId, status) => {
  const response = await axiosInstance.patch(`/tasks/${taskId}/status`, { status });
  return response;
};

/**
 * Get a single task by ID
 * @param {string} taskId - Task UUID
 * @returns {Promise} - Axios response with task details
 */
export const getTaskById = async (taskId) => {
  const response = await axiosInstance.get(`/tasks/${taskId}`);
  return response;
};