/**
 * Token Service - Handles JWT storage, retrieval, and decoding
 */

const TOKEN_KEY = 'jwtToken';

/**
 * Save JWT token to localStorage
 * @param {string} token - JWT token string
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get JWT token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated (token exists)
 * @returns {boolean} - True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Decode JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode base64 payload (second part)
    const payload = parts[1];
    // Base64 decode (handle URL-safe base64)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get user ID from JWT token
 * @returns {string|null} - User ID or null if not found
 */
export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.userId || decoded?.sub || null;
};

/**
 * Get user role from JWT token
 * @returns {string|null} - User role or null if not found
 */
export const getUserRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Get user name from JWT token
 * @returns {string|null} - User name or null if not found
 */
export const getUserNameFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.name || null;
};

/**
 * Get user email from JWT token
 * @returns {string|null} - User email or null if not found
 */
export const getUserEmailFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.email || null;
};