import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';

/**
 * RoleBasedRoute Component
 * Restricts access based on user roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string|string[]} props.allowedRoles - Role or array of roles allowed
 * @param {string} props.redirectTo - Optional redirect path (default: '/')
 */
const RoleBasedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!hasRole(allowedRoles)) {
    // Redirect to home or specified redirect path
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if authorized
  return children;
};

export default RoleBasedRoute;