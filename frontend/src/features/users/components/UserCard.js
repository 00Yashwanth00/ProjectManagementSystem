import React from 'react';

/**
 * UserCard Component
 * Displays user information in a card format
 * 
 * @param {Object} props
 * @param {Object} props.user - User object
 * @param {function} props.onClick - Click handler (optional)
 * @param {boolean} props.compact - Compact mode (default: false)
 */
const UserCard = ({ user, onClick, compact = false }) => {
  if (!user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'var(--color-danger)';
      case 'PROJECT_LEADER':
        return 'var(--color-warning)';
      case 'TEAM_MEMBER':
        return 'var(--color-primary)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  const getRoleBadgeStyle = (role) => ({
    backgroundColor: getRoleColor(role),
    color: 'var(--color-white)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--border-radius-full)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    display: 'inline-block',
  });

  if (compact) {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
          padding: 'var(--spacing-2)',
          borderRadius: 'var(--border-radius-md)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'background var(--transition-fast)',
          ...(onClick && {
            ':hover': {
              backgroundColor: 'var(--color-gray-50)',
            },
          }),
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--border-radius-full)',
          backgroundColor: getRoleColor(user.role),
          color: 'var(--color-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--font-size-sm)',
          flexShrink: 0,
        }}>
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-900)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {user.name}
          </div>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-gray-500)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {user.email}
          </div>
        </div>
        <span style={getRoleBadgeStyle(user.role)}>
          {user.role}
        </span>
      </div>
    );
  }

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        ...(onClick && {
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--shadow-md)',
          },
        }),
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-4)',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--border-radius-full)',
          backgroundColor: getRoleColor(user.role),
          color: 'var(--color-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--font-size-2xl)',
          flexShrink: 0,
        }}>
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-gray-900)',
          }}>
            {user.name}
          </div>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-600)',
            marginTop: 'var(--spacing-1)',
          }}>
            {user.email}
          </div>
          <div style={{ marginTop: 'var(--spacing-2)' }}>
            <span style={getRoleBadgeStyle(user.role)}>
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;