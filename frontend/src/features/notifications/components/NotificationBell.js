// frontend/src/features/notifications/components/NotificationBell.js

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext/NotificationContext';
import { getNotifications, markAsRead, markAllAsRead } from '../../../api/notificationApi/notificationApi';
import {
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  NOTIFICATION_LABELS,
} from '../../../utils/constants/notificationConstants';

const NotificationBell = () => {
  const navigate = useNavigate();
  const { unreadCount, updateUnreadCount, refreshUnreadCount } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // ✅ Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Refetch when opening
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      // Update local state
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

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    setIsOpen(false);
    // Navigate based on notification type
    // This would need to be extended based on your routing
  };

  const formatDate = (dateString) => {
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
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    return NOTIFICATION_ICONS[type] || '📌';
  };

  const getNotificationColor = (type) => {
    return NOTIFICATION_COLORS[type] || 'var(--color-gray-500)';
  };

  const getNotificationLabel = (type) => {
    return NOTIFICATION_LABELS[type] || type;
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button
        onClick={handleToggle}
        style={{
          position: 'relative',
          fontSize: 'var(--font-size-xl)',
          padding: 'var(--spacing-1)',
          borderRadius: 'var(--border-radius-full)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'background var(--transition-fast)',
          color: isOpen ? 'var(--color-primary)' : 'var(--color-gray-600)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-100)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            backgroundColor: 'var(--color-danger)',
            color: 'var(--color-white)',
            fontSize: 'var(--font-size-xs)',
            borderRadius: 'var(--border-radius-full)',
            padding: '2px 6px',
            minWidth: '18px',
            textAlign: 'center',
            fontWeight: 'var(--font-weight-bold)',
            animation: 'pulse 2s infinite',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '380px',
          maxHeight: '500px',
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          zIndex: 'var(--z-dropdown)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: 'var(--spacing-2)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-gray-500)',
                  fontWeight: 'var(--font-weight-normal)',
                }}>
                  ({unreadCount} unread)
                </span>
              )}
            </h4>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--border-radius-md)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-400)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '400px',
          }}>
            {loading ? (
              <div style={{
                padding: 'var(--spacing-4)',
                textAlign: 'center',
                color: 'var(--color-gray-500)',
              }}>
                Loading notifications...
              </div>
            ) : error ? (
              <div style={{
                padding: 'var(--spacing-4)',
                textAlign: 'center',
                color: 'var(--color-danger)',
              }}>
                {error}
                <button
                  onClick={fetchNotifications}
                  style={{
                    display: 'block',
                    margin: 'var(--spacing-2) auto 0',
                    color: 'var(--color-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Retry
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div style={{
                padding: 'var(--spacing-8)',
                textAlign: 'center',
                color: 'var(--color-gray-400)',
              }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-2)' }}>
                  📭
                </div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    cursor: 'pointer',
                    backgroundColor: notification.read ? 'transparent' : 'var(--color-primary-bg)',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background var(--transition-fast)',
                    display: 'flex',
                    gap: 'var(--spacing-3)',
                    alignItems: 'flex-start',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = notification.read ? 'var(--color-gray-50)' : 'var(--color-primary-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.read ? 'transparent' : 'var(--color-primary-bg)';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--border-radius-full)',
                    backgroundColor: getNotificationColor(notification.type),
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-base)',
                    flexShrink: 0,
                  }}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 'var(--spacing-2)',
                    }}>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-gray-500)',
                        whiteSpace: 'nowrap',
                      }}>
                        {getNotificationLabel(notification.type)}
                      </span>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-gray-400)',
                        whiteSpace: 'nowrap',
                      }}>
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-gray-800)',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                    }}>
                      {notification.message}
                    </div>
                    {!notification.read && (
                      <span style={{
                        display: 'inline-block',
                        marginTop: 'var(--spacing-1)',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-primary)',
                      }}>
                        ● New
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: 'var(--spacing-2) var(--spacing-4)',
              borderTop: '1px solid var(--border-color)',
              textAlign: 'center',
            }}>
              <button
                onClick={handleViewAll}
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'var(--font-weight-medium)',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                  borderRadius: 'var(--border-radius-md)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;