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

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await loginApi(email, password);
      const { token } = response.data;
      
      saveToken(token);
      
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

  // ✅ Register - ADMIN only
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // ✅ Remove role from userData if present (backend assigns EMPLOYEE)
      const { role, ...cleanUserData } = userData;
      await registerApi(cleanUserData);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setError(null);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isEmployee = () => {
    return user?.role === 'EMPLOYEE';
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
    isEmployee
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;