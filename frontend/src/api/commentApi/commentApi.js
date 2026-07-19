// frontend/src/api/commentApi/commentApi.js

import axiosInstance from '../axiosInstance';

// ============================================================
// Task Comments
// ============================================================

/**
 * Get all comments for a task
 * @param {string} taskId - Task UUID
 * @returns {Promise} - Axios response with list of comments
 */
export const getTaskComments = async (taskId) => {
  const response = await axiosInstance.get(`/tasks/${taskId}/comments`);
  return response;
};

/**
 * Add a comment to a task
 * @param {string} taskId - Task UUID
 * @param {string} content - Comment content
 * @param {string} parentCommentId - Optional parent comment ID for replies
 * @returns {Promise} - Axios response with created comment
 */
export const addTaskComment = async (taskId, content, parentCommentId = null) => {
  const payload = { content };
  if (parentCommentId) {
    payload.parentCommentId = parentCommentId;
  }
  const response = await axiosInstance.post(`/tasks/${taskId}/comments`, payload);
  return response;
};

// ============================================================
// Issue Comments
// ============================================================

/**
 * Get all comments for an issue
 * @param {string} issueId - Issue UUID
 * @returns {Promise} - Axios response with list of comments
 */
export const getIssueComments = async (issueId) => {
  const response = await axiosInstance.get(`/issues/${issueId}/comments`);
  return response;
};

/**
 * Add a comment to an issue
 * @param {string} issueId - Issue UUID
 * @param {string} content - Comment content
 * @param {string} parentCommentId - Optional parent comment ID for replies
 * @returns {Promise} - Axios response with created comment
 */
export const addIssueComment = async (issueId, content, parentCommentId = null) => {
  const payload = { content };
  if (parentCommentId) {
    payload.parentCommentId = parentCommentId;
  }
  const response = await axiosInstance.post(`/issues/${issueId}/comments`, payload);
  return response;
};

// ============================================================
// Common Comment Operations
// ============================================================

/**
 * Update/Edit a comment
 * @param {string} commentId - Comment UUID
 * @param {string} content - New comment content
 * @returns {Promise} - Axios response with updated comment
 */
export const updateComment = async (commentId, content) => {
  const response = await axiosInstance.put(`/comments/${commentId}`, { content });
  return response;
};

/**
 * Delete a comment
 * @param {string} commentId - Comment UUID
 * @returns {Promise} - Axios response (204 No Content)
 */
export const deleteComment = async (commentId) => {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response;
};

/**
 * Reply to a comment
 * @param {string} commentId - Parent comment UUID
 * @param {string} content - Reply content
 * @returns {Promise} - Axios response with created reply
 */
export const replyToComment = async (commentId, content) => {
  const response = await axiosInstance.post(`/comments/${commentId}/replies`, { content });
  return response;
};

// ============================================================
// Utility Functions
// ============================================================

/**
 * Check if a user can edit/delete a comment
 * This is a client-side helper - actual permissions are enforced on backend
 * @param {Object} comment - Comment object
 * @param {string} currentUserId - Current user's ID
 * @param {string} currentUserRole - Current user's role
 * @returns {Object} - { canEdit: boolean, canDelete: boolean }
 */
export const getCommentPermissions = (comment, currentUserId, currentUserRole) => {
  if (!comment) return { canEdit: false, canDelete: false };
  
  const isAuthor = comment.author?.id === currentUserId;
  const isAdmin = currentUserRole === 'ADMIN';
  
  return {
    canEdit: isAuthor || isAdmin,
    canDelete: isAuthor || isAdmin,
  };
};

/**
 * Format comment timestamp
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted time string (e.g., "2 hours ago")
 */
export const formatCommentDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

/**
 * Extract mentioned users from comment content
 * @param {string} content - Comment content
 * @returns {string[]} - Array of mentioned usernames
 */
export const extractMentions = (content) => {
  if (!content) return [];
  const mentionRegex = /@(\w+)/g;
  const matches = content.match(mentionRegex);
  if (!matches) return [];
  return matches.map(m => m.substring(1)); // Remove @ symbol
};

/**
 * Truncate comment content for preview
 * @param {string} content - Full comment content
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} - Truncated content with ellipsis
 */
export const truncateComment = (content, maxLength = 100) => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};