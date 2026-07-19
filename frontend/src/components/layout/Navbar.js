// frontend/src/components/layout/Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useNotification } from '../../context/NotificationContext/NotificationContext';
import { getMyProjects } from '../../api/projectApi/projectApi';
import NotificationBell from '../../features/notifications/components/NotificationBell';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotification(); // ✅ Get unreadCount from NotificationContext
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // ✅ Handle navigation to first project's tasks
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
      console.error('Failed to fetch projects:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle navigation to first project's issues
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
      console.error('Failed to fetch projects:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const getUserInitial = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'ADMIN': 'Admin',
      'EMPLOYEE': 'Employee'
    };
    return roleMap[role] || role;
  };

  return (
    <nav style={{
      backgroundColor: 'var(--color-white)',
      borderBottom: 'var(--border-width) solid var(--border-color)',
      padding: '0 var(--spacing-4)',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0',
      }}>
        {/* Logo / Brand */}
        <Link to="/" style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-primary)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
        }}>
          <span style={{ fontSize: 'var(--font-size-2xl)' }}>📋</span>
          <span>PMS</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-6)',
        }}>
          {isAuthenticated && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-4)',
            }}>
              {/* Desktop Nav Links */}
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-4)',
              }} className="desktop-nav">
                <Link to="/projects" style={{
                  color: 'var(--color-gray-700)',
                  textDecoration: 'none',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--border-radius-md)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--color-gray-100)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                  Projects
                </Link>
                
                <button
                  onClick={handleTasksClick}
                  disabled={loading}
                  style={{
                    color: 'var(--color-gray-700)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--border-radius-md)',
                    transition: 'background var(--transition-fast)',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'default' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.background = 'var(--color-gray-100)';
                  }}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {loading ? 'Loading...' : 'Tasks'}
                </button>
                
                <button
                  onClick={handleIssuesClick}
                  disabled={loading}
                  style={{
                    color: 'var(--color-gray-700)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--border-radius-md)',
                    transition: 'background var(--transition-fast)',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'default' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.background = 'var(--color-gray-100)';
                  }}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {loading ? 'Loading...' : 'Issues'}
                </button>
                
                {user?.role === 'ADMIN' && (
                  <Link to="/users" style={{
                    color: 'var(--color-gray-700)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    borderRadius: 'var(--border-radius-md)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--color-gray-100)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                    Users
                  </Link>
                )}
              </div>

              {/* User Info & Logout */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-4)',
                borderLeft: 'var(--border-width) solid var(--border-color)',
                paddingLeft: 'var(--spacing-4)',
              }}>
                {/* ✅ Notification Bell */}
                <NotificationBell />

                {/* Clickable User Profile Section */}
                <div 
                  onClick={handleProfileClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-3)',
                    cursor: 'pointer',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--border-radius-full)',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-100)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--border-radius-full)',
                    backgroundColor: user?.role === 'ADMIN' ? 'var(--color-danger)' : 'var(--color-primary)',
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'var(--font-weight-bold)',
                    fontSize: 'var(--font-size-sm)',
                  }}>
                    {getUserInitial()}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-gray-900)',
                    }}>
                      {user?.name || 'User'}
                    </span>
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-gray-500)',
                    }}>
                      {getRoleDisplay(user?.role)}
                    </span>
                  </div>

                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-gray-400)',
                    marginLeft: 'var(--spacing-1)',
                  }}>
                    ▼
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    padding: 'var(--spacing-1) var(--spacing-3)',
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-2)',
            }}>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: 'var(--font-size-sm)' }}>
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            fontSize: 'var(--font-size-2xl)',
            padding: 'var(--spacing-2)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          className="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && isAuthenticated && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-white)',
          borderBottom: 'var(--border-width) solid var(--border-color)',
          padding: 'var(--spacing-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-2)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 'var(--z-dropdown)',
        }}>
          <Link to="/projects" style={{ padding: 'var(--spacing-2)' }}>Projects</Link>
          
          <button
            onClick={handleTasksClick}
            disabled={loading}
            style={{
              padding: 'var(--spacing-2)',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: 'var(--font-size-base)',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.5 : 1,
              color: 'var(--color-gray-700)',
            }}
          >
            {loading ? 'Loading...' : 'Tasks'}
          </button>
          
          <button
            onClick={handleIssuesClick}
            disabled={loading}
            style={{
              padding: 'var(--spacing-2)',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: 'var(--font-size-base)',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.5 : 1,
              color: 'var(--color-gray-700)',
            }}
          >
            {loading ? 'Loading...' : 'Issues'}
          </button>
          
          {user?.role === 'ADMIN' && (
            <Link to="/users" style={{ padding: 'var(--spacing-2)' }}>Users</Link>
          )}
          
          {/* ✅ Notifications link in mobile menu */}
          <Link to="/notifications" style={{ 
            padding: 'var(--spacing-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
          }}>
            🔔 Notifications
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: 'var(--color-danger)',
                color: 'var(--color-white)',
                fontSize: 'var(--font-size-xs)',
                borderRadius: 'var(--border-radius-full)',
                padding: '2px 6px',
                minWidth: '18px',
                textAlign: 'center',
                fontWeight: 'var(--font-weight-bold)',
              }}>
                {unreadCount}
              </span>
            )}
          </Link>
          
          <Link to="/profile" style={{ 
            padding: 'var(--spacing-2)',
            borderTop: 'var(--border-width) solid var(--border-color)',
            marginTop: 'var(--spacing-2)',
            paddingTop: 'var(--spacing-2)',
          }}>
            👤 My Profile
          </Link>
          
          <hr style={{ margin: 'var(--spacing-2) 0' }} />
          <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;