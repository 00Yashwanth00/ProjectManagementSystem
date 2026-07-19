// frontend/src/components/layout/Sidebar.js

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useNotification } from '../../context/NotificationContext/NotificationContext';
import { getMyProjects } from '../../api/projectApi/projectApi';

const Sidebar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleTasksClick = async () => {
    try {
      setLoading(true);
      const response = await getMyProjects();
      if (response.data && response.data.length > 0) {
        navigate(`/projects/${response.data[0].id}/tasks`);
      } else {
        navigate('/projects');
      }
    } catch (error) {
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleIssuesClick = async () => {
    try {
      setLoading(true);
      const response = await getMyProjects();
      if (response.data && response.data.length > 0) {
        navigate(`/projects/${response.data[0].id}/issues`);
      } else {
        navigate('/projects');
      }
    } catch (error) {
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    if (role === 'ADMIN') return 'Admin';
    return 'Employee';
  };

  // ✅ Nav items - Notifications now goes to /notifications page
  const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/projects', label: 'Projects', icon: '📁' },
    { 
      type: 'button',
      onClick: handleTasksClick,
      label: 'Tasks', 
      icon: '✅',
      loading: loading
    },
    { 
      type: 'button',
      onClick: handleIssuesClick,
      label: 'Issues', 
      icon: '🐛',
      loading: loading
    },
    { 
      to: '/notifications', 
      label: 'Notifications', 
      icon: '🔔',
      badge: unreadCount > 0 ? unreadCount : null
    },
  ];

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
        {navItems.map((item) => {
          if (item.type === 'button') {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                disabled={item.loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  color: 'var(--color-gray-700)',
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  margin: '0 var(--spacing-2)',
                  fontWeight: 'var(--font-weight-normal)',
                  transition: 'all var(--transition-fast)',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: item.loading ? 'default' : 'pointer',
                  opacity: item.loading ? 0.5 : 1,
                  fontSize: 'var(--font-size-base)',
                }}
                onMouseEnter={(e) => {
                  if (!item.loading) e.currentTarget.style.background = 'var(--color-gray-50)';
                }}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 'var(--font-size-xl)' }}>{item.icon}</span>
                <span>{item.loading ? 'Loading...' : item.label}</span>
              </button>
            );
          }
          
          return (
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
              {item.badge && (
                <span style={{
                  marginLeft: 'auto',
                  backgroundColor: 'var(--color-danger)',
                  color: 'var(--color-white)',
                  fontSize: 'var(--font-size-xs)',
                  borderRadius: 'var(--border-radius-full)',
                  padding: '2px 6px',
                  minWidth: '18px',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Clickable User Profile Section at bottom */}
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