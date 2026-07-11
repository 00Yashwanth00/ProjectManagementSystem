import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Navigate to profile page
  const handleProfileClick = () => {
    navigate('/profile');
  };

  // ✅ Role display mapping
  const getRoleDisplay = (role) => {
    if (role === 'ADMIN') return 'Admin';
    return 'Employee';
  };

  // ✅ Base nav items for all authenticated users
  const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/projects', label: 'Projects', icon: '📁' },
    { to: '/tasks', label: 'Tasks', icon: '✅' },
    { to: '/issues', label: 'Issues', icon: '🐛' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
  ];

  // ✅ Admin-only items
  if (user?.role === 'ADMIN') {
    navItems.push({ to: '/users', label: 'Users', icon: '👥' });
  }

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--color-white)',
      borderRight: 'var(--border-width) solid var(--border-color)',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
      overflowY: 'auto',
      padding: 'var(--spacing-4) 0',
    }}>
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-1)',
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              padding: 'var(--spacing-3) var(--spacing-4)',
              color: isActive ? 'var(--color-primary)' : 'var(--color-gray-700)',
              backgroundColor: isActive ? 'var(--color-primary-bg)' : 'transparent',
              textDecoration: 'none',
              borderRadius: 'var(--border-radius-md)',
              margin: '0 var(--spacing-2)',
              fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
              transition: 'all var(--transition-fast)',
            })}
          >
            <span style={{ fontSize: 'var(--font-size-xl)' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ✅ Clickable User Profile Section at bottom */}
      <div 
        onClick={handleProfileClick}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'var(--spacing-4)',
          borderTop: 'var(--border-width) solid var(--border-color)',
          margin: '0',
          cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-50)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--border-radius-full)',
            backgroundColor: user?.role === 'ADMIN' ? 'var(--color-danger)' : 'var(--color-primary)',
            color: 'var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-lg)',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-gray-900)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.name || 'User'}
            </div>
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-gray-500)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {getRoleDisplay(user?.role)}
            </div>
          </div>
          {/* Profile indicator */}
          <span style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-gray-400)',
          }}>
            👤
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;