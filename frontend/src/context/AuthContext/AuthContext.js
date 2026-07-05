import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  saveToken,
  removeToken,
  isAuthenticated,
  getUserIdFromToken,
  getUserRoleFromToken,
  getUserNameFromToken,
  getUserEmailFromToken,
} from '../../services/tokenService/tokenService';
import { login as loginApi, register as registerApi } from '../../api/authApi/authApi';

// Create Auth Context
const AuthContext = createContext();

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    const loadUserFromToken = () => {
      if (isAuthenticated()) {
        const userId = getUserIdFromToken();
        const role = getUserRoleFromToken();
        const name = getUserNameFromToken();
        const email = getUserEmailFromToken();
        
        setUser({
          id: userId,
          role: role,
          name: name,
          email: email,
        });
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await loginApi(email, password);
      const { token } = response.data;
      
      // Save token
      saveToken(token);
      
      // Extract user info from token
      const userId = getUserIdFromToken();
      const role = getUserRoleFromToken();
      const name = getUserNameFromToken();
      const userEmail = getUserEmailFromToken();
      
      const userData = {
        id: userId,
        role: role,
        name: name,
        email: userEmail,
      };
      
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Register user
   * @param {Object} userData - User registration data
   */
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      await registerApi(userData);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    removeToken();
    setUser(null);
    setError(null);
  };

  /**
   * Check if user has a specific role
   * @param {string|string[]} roles - Role or array of roles to check
   * @returns {boolean} - True if user has any of the specified roles
   */
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  /**
   * Check if user is ADMIN
   */
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  /**
   * Check if user is PROJECT_LEADER
   */
  const isProjectLeader = () => {
    return user?.role === 'PROJECT_LEADER';
  };

  /**
   * Check if user is TEAM_MEMBER
   */
  const isTeamMember = () => {
    return user?.role === 'TEAM_MEMBER';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
    isAdmin,
    isProjectLeader,
    isTeamMember,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use Auth Context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;