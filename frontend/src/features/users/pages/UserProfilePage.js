import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import UserCard from '../components/UserCard';
import { getUserById } from '../../../api/userApi/userApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If no userId provided, use current user
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
      const response = await getUserById(id);
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

  // Check if viewing own profile
  const isOwnProfile = currentUser?.id === user?.id;

  return (
    <PageWrapper
      title={isOwnProfile ? 'My Profile' : 'User Profile'}
      subtitle={isOwnProfile ? 'View and manage your profile' : 'View user details'}
      actions={
        <>
          {isOwnProfile && (
            <button className="btn btn-primary">
              ✏️ Edit Profile
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
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
          <UserCard user={user} />

          {/* Additional profile details */}
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
                  {user.role}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Name
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
                  Email
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