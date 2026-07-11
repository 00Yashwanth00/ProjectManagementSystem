import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import { getUserById, getCurrentUser } from '../../../api/userApi/userApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ If no userId provided, use current user
  const targetUserId = userId || currentUser?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchUser(targetUserId);
    } else {
      setError('User ID not provided');
      setLoading(false);
    }
  }, [targetUserId]);

  const fetchUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ If viewing own profile, use /me endpoint
      let response;
      if (id === currentUser?.id) {
        response = await getCurrentUser();
      } else {
        response = await getUserById(id);
      }
      
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError(err.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (targetUserId) {
      fetchUser(targetUserId);
    }
  };

  // ✅ Check if viewing own profile
  const isOwnProfile = currentUser?.id === user?.id;

  // ✅ Get role display
  const getRoleDisplay = (role) => {
    const roleMap = {
      'ADMIN': 'Admin',
      'EMPLOYEE': 'Employee'
    };
    return roleMap[role] || role;
  };

  // ✅ Get role color
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

  return (
    <PageWrapper
      title={isOwnProfile ? 'My Profile' : 'User Profile'}
      subtitle={isOwnProfile ? 'View and manage your profile' : 'View user details'}
      actions={
        <>
          {isOwnProfile && (
            <button 
              className="btn btn-secondary"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? 'Loading...' : '🔄 Refresh'}
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            ← Back to Dashboard
          </button>
        </>
      }
    >
      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading user profile...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
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

      {/* User Profile */}
      {!loading && !error && user && (
        <div>
          {/* Profile Card */}
          <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-6)',
              flexWrap: 'wrap',
            }}>
              {/* Avatar */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: 'var(--border-radius-full)',
                backgroundColor: getRoleColor(user.role),
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'var(--font-weight-bold)',
                fontSize: 'var(--font-size-4xl)',
                flexShrink: 0,
              }}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              {/* User Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-gray-900)',
                }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-gray-600)',
                  marginTop: 'var(--spacing-1)',
                }}>
                  {user.email}
                </div>
                <div style={{ marginTop: 'var(--spacing-2)' }}>
                  <span style={{
                    backgroundColor: getRoleColor(user.role),
                    color: 'var(--color-white)',
                    padding: 'var(--spacing-1) var(--spacing-3)',
                    borderRadius: 'var(--border-radius-full)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    display: 'inline-block',
                  }}>
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="card" style={{ marginTop: 'var(--spacing-4)' }}>
            <h4 style={{ marginBottom: 'var(--spacing-4)' }}>Profile Details</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-4)',
            }}>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  User ID
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-gray-900)',
                  wordBreak: 'break-all',
                }}>
                  {user.id}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Role
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-gray-900)',
                }}>
                  {getRoleDisplay(user.role)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Full Name
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-gray-900)',
                }}>
                  {user.name}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Email Address
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-gray-900)',
                }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Back button if viewing other user */}
          {!isOwnProfile && (
            <div style={{ marginTop: 'var(--spacing-4)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/users')}
              >
                ← Back to Users
              </button>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default UserProfilePage;