// frontend/src/features/notifications/pages/NotificationsPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import NotificationItem from '../components/NotificationItem';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../../../api/notificationApi/notificationApi';
import { useNotification } from '../../../context/NotificationContext/NotificationContext';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { unreadCount, updateUnreadCount, refreshUnreadCount } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      updateUnreadCount(-1);
      refreshUnreadCount();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      updateUnreadCount(-unreadCount);
      refreshUnreadCount();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.read) {
        updateUnreadCount(-1);
        refreshUnreadCount();
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) return;

    try {
      await deleteAllNotifications();
      setNotifications([]);
      updateUnreadCount(-unreadCount);
      refreshUnreadCount();
    } catch (err) {
      console.error('Failed to delete all notifications:', err);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <PageWrapper
      title="Notifications"
      subtitle={`${unreadNotifications.length} unread, ${notifications.length} total`}
      actions={
        <>
          {unreadNotifications.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={handleMarkAllAsRead}
              disabled={loading}
            >
              ✓ Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={handleDeleteAll}
              disabled={loading}
            >
              🗑️ Delete All
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </>
      }
    >
      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-2)',
        marginBottom: 'var(--spacing-4)',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: 'var(--spacing-2)',
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: 'var(--spacing-1) var(--spacing-4)',
            borderRadius: 'var(--border-radius-full)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: filter === 'all' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
            backgroundColor: filter === 'all' ? 'var(--color-primary)' : 'transparent',
            color: filter === 'all' ? 'var(--color-white)' : 'var(--color-gray-600)',
            transition: 'all var(--transition-fast)',
          }}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: 'var(--spacing-1) var(--spacing-4)',
            borderRadius: 'var(--border-radius-full)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: filter === 'unread' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
            backgroundColor: filter === 'unread' ? 'var(--color-primary)' : 'transparent',
            color: filter === 'unread' ? 'var(--color-white)' : 'var(--color-gray-600)',
            transition: 'all var(--transition-fast)',
          }}
        >
          Unread ({unreadNotifications.length})
        </button>
        <button
          onClick={() => setFilter('read')}
          style={{
            padding: 'var(--spacing-1) var(--spacing-4)',
            borderRadius: 'var(--border-radius-full)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: filter === 'read' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
            backgroundColor: filter === 'read' ? 'var(--color-primary)' : 'transparent',
            color: filter === 'read' ? 'var(--color-white)' : 'var(--color-gray-600)',
            transition: 'all var(--transition-fast)',
          }}
        >
          Read ({notifications.length - unreadNotifications.length})
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
          <button
            onClick={handleRefresh}
            style={{
              marginLeft: 'var(--spacing-2)',
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading notifications...</p>
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <>
          {filteredNotifications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-4)' }}>
                📭
              </div>
              <h3 style={{ marginBottom: 'var(--spacing-2)' }}>No notifications</h3>
              <p style={{ color: 'var(--color-gray-500)' }}>
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications." 
                  : filter === 'read'
                  ? "You don't have any read notifications yet."
                  : "You don't have any notifications yet."}
              </p>
              {filter !== 'all' && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setFilter('all')}
                  style={{ marginTop: 'var(--spacing-4)' }}
                >
                  View All
                </button>
              )}
            </div>
          ) : (
            <div className="card">
              <div>
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default NotificationsPage;