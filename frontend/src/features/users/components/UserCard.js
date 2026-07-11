import React from 'react';

const UserCard = ({ user, onClick, compact = false }) => {
  if (!user) return null;

  // ✅ Only ADMIN and EMPLOYEE are system roles
  const getRoleDisplay = (role) => {
    if (!role) return 'Employee';
    
    const roleMap = {
      'ADMIN': 'Admin',
      'EMPLOYEE': 'Employee'
    };
    
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'var(--color-danger)';
      case 'EMPLOYEE':
        return 'var(--color-gray-500)';
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

  // ✅ Use roleDisplay if provided (for project-specific roles like PROJECT_LEADER or TEAM_MEMBER)
  const displayRole = user.roleDisplay || getRoleDisplay(user.role);
  const roleForColor = user.role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE';

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
          backgroundColor: getRoleColor(roleForColor),
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
        <span style={getRoleBadgeStyle(roleForColor)}>
          {displayRole}
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
          backgroundColor: getRoleColor(roleForColor),
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
            <span style={getRoleBadgeStyle(roleForColor)}>
              {displayRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;