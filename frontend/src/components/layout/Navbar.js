import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
                <Link to="/tasks" style={{
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
                  Tasks
                </Link>
                <Link to="/issues" style={{
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
                  Issues
                </Link>
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
                {/* Notifications */}
                <Link to="/notifications" style={{
                  color: 'var(--color-gray-600)',
                  fontSize: 'var(--font-size-xl)',
                  textDecoration: 'none',
                  position: 'relative',
                  padding: 'var(--spacing-1)',
                  borderRadius: 'var(--border-radius-full)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--color-gray-100)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                  🔔
                  {/* Notification badge - will be dynamic later */}
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
                  }}>
                    0
                  </span>
                </Link>

                {/* User Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--border-radius-full)',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'var(--font-weight-bold)',
                    fontSize: 'var(--font-size-sm)',
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
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
                      {user?.role || 'Role'}
                    </span>
                  </div>
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
          <Link to="/tasks" style={{ padding: 'var(--spacing-2)' }}>Tasks</Link>
          <Link to="/issues" style={{ padding: 'var(--spacing-2)' }}>Issues</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/users" style={{ padding: 'var(--spacing-2)' }}>Users</Link>
          )}
          <Link to="/notifications" style={{ padding: 'var(--spacing-2)' }}>Notifications</Link>
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