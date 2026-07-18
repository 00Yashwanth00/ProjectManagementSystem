import React, { useState, useEffect } from 'react';
import { getProjectMembers } from '../../../api/projectApi/projectApi';

/**
 * ProjectMemberSelect Component
 * Reusable dropdown for selecting only project members
 * Used for task assignment
 * 
 * @param {Object} props
 * @param {string} props.projectId - Project UUID
 * @param {string} props.value - Currently selected user ID
 * @param {function} props.onChange - Callback when selection changes
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.label - Optional label
 * @param {boolean} props.required - Whether the field is required
 * @param {boolean} props.disabled - Whether the field is disabled
 * @param {Array} props.excludeUserIds - Array of user IDs to exclude
 * @param {string} props.size - Size of the select (sm, md, lg)
 */
const ProjectMemberSelect = ({
  projectId,
  value,
  onChange,
  placeholder = 'Select a team member',
  label,
  required = false,
  disabled = false,
  excludeUserIds = [],
  size = 'md',
  className = '',
}) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectMembers();
    }
  }, [projectId]);

  const fetchProjectMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjectMembers(projectId);
      
      // Filter out excluded users
      let filteredMembers = response.data;
      if (excludeUserIds.length > 0) {
        filteredMembers = filteredMembers.filter(
          user => !excludeUserIds.includes(user.id)
        );
      }
      
      setMembers(filteredMembers);
    } catch (err) {
      console.error('Failed to fetch project members:', err);
      setError('Failed to load project members');
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = members.find(u => u.id === userId);
    return user ? user.name : '';
  };

  const handleChange = (e) => {
    const selectedId = e.target.value;
    onChange(selectedId);
  };

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
          <option>Loading team members...</option>
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
            onClick={fetchProjectMembers}
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
          htmlFor="project-member-select"
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
        id="project-member-select"
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || members.length === 0}
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
        {members.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
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
      {members.length === 0 && (
        <div style={{
          marginTop: 'var(--spacing-1)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-gray-400)',
        }}>
          💡 No members available in this project
        </div>
      )}
    </div>
  );
};

export default ProjectMemberSelect;