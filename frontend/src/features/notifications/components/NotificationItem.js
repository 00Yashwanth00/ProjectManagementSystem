// frontend/src/features/notifications/components/NotificationItem.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  NOTIFICATION_LABELS,
} from '../../../utils/constants/notificationConstants';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    // Handle navigation based on notification type
    // This can be extended based on your routing
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
    <div
      onClick={handleClick}
      style={{
        padding: 'var(--spacing-3) var(--spacing-4)',
        cursor: 'pointer',
        backgroundColor: notification.read ? 'transparent' : 'var(--color-primary-bg)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'background var(--transition-fast)',
        display: 'flex',
        gap: 'var(--spacing-3)',
        alignItems: 'flex-start',
        position: 'relative',
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

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-400)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--spacing-1)',
            borderRadius: 'var(--border-radius-md)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-danger)';
            e.currentTarget.style.background = 'var(--color-danger-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-gray-400)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default NotificationItem;