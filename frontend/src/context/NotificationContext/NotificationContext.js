// frontend/src/context/NotificationContext/NotificationContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getUnreadCount } from '../../api/notificationApi/notificationApi';
import { useAuth } from '../AuthContext/AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
      setError(err.response?.data?.message || 'Failed to fetch unread count');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ✅ Update unread count (called after marking as read)
  const updateUnreadCount = useCallback((delta) => {
    setUnreadCount(prev => Math.max(0, prev + delta));
  }, []);

  // ✅ Refresh unread count
  const refreshUnreadCount = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // ✅ Fetch on mount and when authentication changes
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // ✅ Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  const value = {
    unreadCount,
    loading,
    error,
    fetchUnreadCount,
    updateUnreadCount,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;