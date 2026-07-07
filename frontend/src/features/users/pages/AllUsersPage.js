import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../components/layout/PageWrapper';
import UserCard from '../components/UserCard';
import { getAllUsers } from '../../../api/userApi/userApi';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log('Fetching all users from AllUsersPage...');
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const leaderCount = users.filter(u => u.role === 'PROJECT_LEADER').length;
  const memberCount = users.filter(u => u.role === 'TEAM_MEMBER').length;

  // Refresh handler
  const handleRefresh = () => {
    fetchUsers();
  };

  return (
    <PageWrapper
      title="All Users"
      subtitle={`${totalUsers} users in the system`}
      actions={
        <>
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
      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
            {totalUsers}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Total Users</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger)' }}>
            {adminCount}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Admins</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
            {leaderCount}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Project Leaders</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
            {memberCount}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Team Members</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: 'var(--spacing-2) var(--spacing-3)',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
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

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading users...</p>
        </div>
      )}

      {/* User List */}
      {!loading && !error && (
        <>
          {filteredUsers.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <p style={{ color: 'var(--color-gray-500)' }}>
                {searchTerm ? 'No users match your search' : 'No users found'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default AllUsersPage;