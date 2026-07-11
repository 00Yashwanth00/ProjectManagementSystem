import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../components/layout/PageWrapper';
import UserCard from '../components/UserCard';
import { getAllUsers } from '../../../api/userApi/userApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const AllUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
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

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Stats - only ADMIN and EMPLOYEE roles
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const employeeCount = users.filter(u => u.role === 'EMPLOYEE').length;

  // ✅ Helper to get role display
  const getRoleDisplay = (role) => {
    const roleMap = {
      'ADMIN': 'Admin',
      'EMPLOYEE': 'Employee'
    };
    return roleMap[role] || role;
  };

  if (!isAdmin) {
    return (
      <PageWrapper title="Access Denied">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <h3 style={{ color: 'var(--color-danger)' }}>⛔ Access Denied</h3>
          <p style={{ color: 'var(--color-gray-500)' }}>
            You don't have permission to view this page.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.history.back()}
            style={{ marginTop: 'var(--spacing-4)' }}
          >
            Go Back
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="All Users"
      subtitle={`${totalUsers} users in the system`}
      actions={
        <>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/register'}
          >
            + New User
          </button>
          <button
            className="btn btn-secondary"
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-3" style={{ marginBottom: 'var(--spacing-6)' }}>
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
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
            {employeeCount}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Employees</div>
        </div>
      </div>

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

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
          <button
            onClick={fetchUsers}
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

      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading users...</p>
        </div>
      )}

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
                <UserCard 
                  key={user.id} 
                  user={{
                    ...user,
                    roleDisplay: getRoleDisplay(user.role)
                  }} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default AllUsersPage;