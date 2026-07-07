import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../../api/userApi/userApi';

/**
 * UserSelect Component
 * Reusable dropdown for selecting a user
 * Used in task assignment, issue assignment, project members, etc.
 * 
 * @param {Object} props
 * @param {string} props.value - Currently selected user ID
 * @param {function} props.onChange - Callback when selection changes
 * @param {string} props.placeholder - Placeholder text (default: "Select a user")
 * @param {string} props.label - Optional label for the select
 * @param {boolean} props.required - Whether the field is required
 * @param {boolean} props.disabled - Whether the field is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {Array} props.excludeUserIds - Array of user IDs to exclude from the list
 * @param {string} props.size - Size of the select (sm, md, lg)
 */
const UserSelect = ({
  value,
  onChange,
  placeholder = 'Select a user',
  label,
  required = false,
  disabled = false,
  className = '',
  excludeUserIds = [],
  size = 'md',
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers();
      // Filter out excluded users
      const filteredUsers = response.data.filter(
        user => !excludeUserIds.includes(user.id)
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : '';
  };

  // Handle change
  const handleChange = (e) => {
    const selectedId = e.target.value;
    onChange(selectedId);
  };

  // Size styles
  const sizeStyles = {
    sm: { padding: 'var(--spacing-1) var(--spacing-2)', fontSize: 'var(--font-size-sm)' },
    md: { padding: 'var(--spacing-2) var(--spacing-3)', fontSize: 'var(--font-size-base)' },
    lg: { padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-lg)' },
  };

  if (loading) {
    return (
      <div className={className}>
        {label && (
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-1)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
          }}>
            {label}
          </label>
        )}
        <select disabled style={{ width: '100%', ...sizeStyles[size] }}>
          <option>Loading users...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        {label && (
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-1)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
          }}>
            {label}
          </label>
        )}
        <div className="alert alert-danger" style={{ fontSize: 'var(--font-size-sm)' }}>
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
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor="user-select"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-1)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-700)',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-danger)', marginLeft: 'var(--spacing-1)' }}>*</span>}
        </label>
      )}
      <select
        id="user-select"
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || users.length === 0}
        required={required}
        style={{
          width: '100%',
          ...sizeStyles[size],
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-gray-900)',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.boxShadow = '0 0 0 3px var(--color-primary-bg)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.boxShadow = 'none';
        }}
      >
        <option value="">{placeholder}</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email}) - {user.role}
          </option>
        ))}
      </select>
      {value && (
        <div style={{
          marginTop: 'var(--spacing-1)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-gray-500)',
        }}>
          Selected: {getUserName(value)}
        </div>
      )}
    </div>
  );
};

export default UserSelect;