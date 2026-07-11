import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../../api/userApi/userApi';

/**
 * MultiUserSelect Component
 * Reusable multi-select dropdown for selecting multiple users
 * Used for adding multiple members to a project
 * 
 * @param {Object} props
 * @param {string[]} props.value - Array of selected user IDs
 * @param {function} props.onChange - Callback when selection changes
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.label - Optional label for the select
 * @param {boolean} props.required - Whether the field is required
 * @param {boolean} props.disabled - Whether the field is disabled
 * @param {string[]} props.excludeUserIds - Array of user IDs to exclude
 */
const MultiUserSelect = ({
  value = [],
  onChange,
  placeholder = 'Select users...',
  label,
  required = false,
  disabled = false,
  excludeUserIds = [],
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // Check if user is selected
  const isSelected = (userId) => {
    return value.includes(userId);
  };

  // Toggle user selection
  const toggleUser = (userId) => {
    if (isSelected(userId)) {
      onChange(value.filter(id => id !== userId));
    } else {
      onChange([...value, userId]);
    }
  };

  // Remove a user from selection
  const removeUser = (userId) => {
    onChange(value.filter(id => id !== userId));
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : '';
  };

  // Get user email by ID
  const getUserEmail = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : '';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.multi-user-select')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (loading) {
    return (
      <div className="multi-user-select">
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
        <div style={{
          padding: 'var(--spacing-2)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          backgroundColor: 'var(--color-gray-50)',
          color: 'var(--color-gray-500)',
        }}>
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="multi-user-select">
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
    <div className="multi-user-select" style={{ position: 'relative' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 'var(--spacing-1)',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gray-700)',
        }}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)', marginLeft: 'var(--spacing-1)' }}>*</span>}
        </label>
      )}

      {/* Selected Users Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          minHeight: '42px',
          padding: 'var(--spacing-2)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          backgroundColor: disabled ? 'var(--color-gray-50)' : 'var(--color-white)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-1)',
          alignItems: 'center',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-primary-bg)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {value.length === 0 ? (
          <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>
            {placeholder}
          </span>
        ) : (
          value.map((userId) => (
            <span
              key={userId}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
                backgroundColor: 'var(--color-primary-bg)',
                color: 'var(--color-primary)',
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--border-radius-full)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {getUserName(userId)}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUser(userId);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                    padding: '0 var(--spacing-1)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  ×
                </button>
              )}
            </span>
          ))
        )}
        {!disabled && (
          <span style={{ marginLeft: 'auto', color: 'var(--color-gray-400)' }}>
            {isOpen ? '▲' : '▼'}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 'var(--spacing-1)',
          backgroundColor: 'var(--color-white)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '300px',
          overflow: 'hidden',
          zIndex: 'var(--z-dropdown)',
        }}>
          {/* Search */}
          <div style={{ padding: 'var(--spacing-2)', borderBottom: 'var(--border-width) solid var(--border-color)' }}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-1) var(--spacing-2)',
                fontSize: 'var(--font-size-sm)',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* User List */}
          <div style={{
            maxHeight: '240px',
            overflowY: 'auto',
            padding: 'var(--spacing-1) 0',
          }}>
            {filteredUsers.length === 0 ? (
              <div style={{
                padding: 'var(--spacing-3)',
                textAlign: 'center',
                color: 'var(--color-gray-500)',
                fontSize: 'var(--font-size-sm)',
              }}>
                {searchTerm ? 'No users match your search' : 'No users available'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-3)',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    cursor: 'pointer',
                    backgroundColor: isSelected(user.id) ? 'var(--color-primary-bg)' : 'transparent',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected(user.id)) {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected(user.id)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected(user.id)}
                    onChange={() => toggleUser(user.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-gray-900)',
                    }}>
                      {user.name}
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-gray-500)',
                    }}>
                      {user.email} • {user.role}
                    </div>
                  </div>
                  {isSelected(user.id) && (
                    <span style={{ color: 'var(--color-primary)' }}>✓</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: 'var(--spacing-2)',
            borderTop: 'var(--border-width) solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-500)',
          }}>
            <span>{value.length} user(s) selected</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiUserSelect;