import axiosInstance from '../axiosInstance';

export const getTasksByProject = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/tasks`);
  return response;
};

export const createTask = async (projectId, taskData) => {
  const response = await axiosInstance.post(`/projects/${projectId}/tasks`, taskData);
  return response;
};

// ✅ Get task by ID with project context
export const getTaskById = async (projectId, taskId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/tasks/${taskId}`);
  return response;
};

// ✅ Assign task with project context
export const assignTask = async (projectId, taskId, userId) => {
  const response = await axiosInstance.post(`/projects/${projectId}/tasks/${taskId}/assign/${userId}`);
  return response;
};

// ✅ Update task status with project context
export const updateTaskStatus = async (projectId, taskId, status) => {
  const response = await axiosInstance.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
  return response;
};