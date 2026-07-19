// frontend/src/api/issueApi/issueApi.js

import axiosInstance from '../axiosInstance';

/**
 * Get all issues for a project
 * @param {string} projectId - Project UUID
 * @returns {Promise} - Axios response with list of issues
 */
export const getIssuesByProject = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/issues`);
  return response;
};

/**
 * Create a new issue in a project
 * @param {string} projectId - Project UUID
 * @param {Object} issueData - Issue data
 * @param {string} issueData.title - Issue title
 * @param {string} issueData.description - Issue description
 * @param {string} issueData.type - Issue type (BUG, ISSUE)
 * @param {string} issueData.priority - Issue priority (LOW, MEDIUM, HIGH, CRITICAL)
 * @param {string} issueData.taskId - Optional task UUID to link
 * @returns {Promise} - Axios response with created issue
 */
export const createIssue = async (projectId, issueData) => {
  const response = await axiosInstance.post(`/projects/${projectId}/issues`, issueData);
  return response;
};

/**
 * Get issue by ID
 * @param {string} projectId - Project UUID
 * @param {string} issueId - Issue UUID
 * @returns {Promise} - Axios response with issue details
 */
export const getIssueById = async (projectId, issueId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/issues/${issueId}`);
  return response;
};

/**
 * Assign an issue to a user
 * @param {string} projectId - Project UUID
 * @param {string} issueId - Issue UUID
 * @param {string} userId - User UUID to assign
 * @returns {Promise} - Axios response
 */
export const assignIssue = async (projectId, issueId, userId) => {
  const response = await axiosInstance.post(`/projects/${projectId}/issues/${issueId}/assign/${userId}`);
  return response;
};

/**
 * Update issue status
 * @param {string} projectId - Project UUID
 * @param {string} issueId - Issue UUID
 * @param {string} status - New status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
 * @returns {Promise} - Axios response
 */
export const updateIssueStatus = async (projectId, issueId, status) => {
  const response = await axiosInstance.patch(`/projects/${projectId}/issues/${issueId}/status`, { status });
  return response;
};