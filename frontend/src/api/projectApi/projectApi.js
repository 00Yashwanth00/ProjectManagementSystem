import axiosInstance from '../axiosInstance';

/**
 * Create a new project (ADMIN only)
 */
export const createProject = async (projectData) => {
  const response = await axiosInstance.post('/projects', projectData);
  return response;
};

/**
 * Get all projects (ADMIN sees all, others see only their projects)
 * The backend should handle this filtering based on the authenticated user
 */
export const getAllProjects = async () => {
  const response = await axiosInstance.get('/projects');
  return response;
};

/**
 * Get projects where user is a member
 */
export const getMyProjects = async () => {
  const response = await axiosInstance.get('/projects/my');
  return response;
};

/**
 * Get project by ID
 */
export const getProjectById = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}`);
  return response;
};

/**
 * Add multiple members to project
 */
export const addProjectMembers = async (projectId, userIds) => {
  const response = await axiosInstance.post(`/projects/${projectId}/members`, userIds);
  return response;
};

/**
 * Remove member from project
 */
export const removeProjectMember = async (projectId, userId) => {
  const response = await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
  return response;
};

/**
 * Update project leader
 */
export const updateProjectLeader = async (projectId, leaderId) => {
  const response = await axiosInstance.patch(`/projects/${projectId}/leader`, { leaderId });
  return response;
};