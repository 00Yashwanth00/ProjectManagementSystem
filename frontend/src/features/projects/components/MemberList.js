import React, { useState } from 'react';
import UserCard from '../../users/components/UserCard';
import MultiUserSelect from '../../users/components/MultiUserSelect';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { addProjectMembers, removeProjectMember } from '../../../api/projectApi/projectApi';

const MemberList = ({ project, onMemberChange }) => {
  const { user: currentUser } = useAuth();
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const members = project?.members || [];
  const projectLeaderId = project?.leader?.id;

  // ✅ Only ADMIN can manage members
  const isAdmin = currentUser?.role === 'ADMIN';
  const canManageMembers = isAdmin;

  // ✅ Sort members: Project Leader first, then Team Members
  const sortedMembers = [...members].sort((a, b) => {
    // Project Leader comes first
    if (a.projectRole === 'PROJECT_LEADER' && b.projectRole !== 'PROJECT_LEADER') {
      return -1;
    }
    if (a.projectRole !== 'PROJECT_LEADER' && b.projectRole === 'PROJECT_LEADER') {
      return 1;
    }
    // If both are same role, sort by name
    return (a.user.name || '').localeCompare(b.user.name || '');
  });

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) {
      setError('Please select at least one user');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await addProjectMembers(project.id, selectedUserIds);

      setSelectedUserIds([]);
      setShowAddMember(false);

      if (onMemberChange) {
        onMemberChange();
      }
    } catch (err) {
      console.error('Failed to add members:', err);
      setError(err.response?.data?.message || 'Failed to add members');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await removeProjectMember(project.id, userId);

      if (onMemberChange) {
        onMemberChange();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  // Get existing member IDs to exclude from add dropdown
  const existingMemberIds = members.map(m => m.user.id);

  const getProjectRoleDisplay = (projectRole) => {
    if (projectRole === 'PROJECT_LEADER') {
      return {
        label: 'PROJECT_LEADER',
        displayName: 'Project Leader',
        icon: '👑',
        color: 'var(--color-primary)',
      };
    }
    return {
      label: 'TEAM_MEMBER',
      displayName: 'Team Member',
      icon: '👤',
      color: 'var(--color-gray-500)',
    };
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-4)',
      }}>
        <h4 style={{ margin: 0 }}>
          Team Members ({members.length})
        </h4>
        {canManageMembers && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddMember(!showAddMember);
              if (!showAddMember) {
                setSelectedUserIds([]);
                setError(null);
              }
            }}
            style={{ fontSize: 'var(--font-size-sm)' }}
          >
            {showAddMember ? 'Cancel' : '+ Add Members'}
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: 'var(--spacing-2)',
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {showAddMember && (
        <div style={{
          marginBottom: 'var(--spacing-4)',
          padding: 'var(--spacing-4)',
          backgroundColor: 'var(--color-gray-50)',
          borderRadius: 'var(--border-radius-md)',
        }}>
          <MultiUserSelect
            label="Select Users to Add"
            value={selectedUserIds}
            onChange={setSelectedUserIds}
            placeholder="Search and select users..."
            excludeUserIds={existingMemberIds}
            disabled={loading}
          />
          <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', gap: 'var(--spacing-2)' }}>
            <button
              className="btn btn-primary"
              onClick={handleAddMembers}
              disabled={loading || selectedUserIds.length === 0}
              style={{ fontSize: 'var(--font-size-sm)' }}
            >
              {loading ? 'Adding...' : `Add ${selectedUserIds.length} Member${selectedUserIds.length > 1 ? 's' : ''}`}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddMember(false)}
              disabled={loading}
              style={{ fontSize: 'var(--font-size-sm)' }}
            >
              Cancel
            </button>
          </div>
          {selectedUserIds.length > 0 && (
            <div style={{
              marginTop: 'var(--spacing-2)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-gray-500)',
            }}>
              Selected: {selectedUserIds.length} user(s) will be added as Team Members
            </div>
          )}
        </div>
      )}

      {members.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-6)',
          color: 'var(--color-gray-500)',
          backgroundColor: 'var(--color-gray-50)',
          borderRadius: 'var(--border-radius-md)',
        }}>
          No members in this project yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {/* ✅ Show sorted members with leader first */}
          {sortedMembers.map((member) => {
            const isLeader = member.projectRole === 'PROJECT_LEADER';
            const canRemove = isAdmin && !isLeader;
            const roleInfo = getProjectRoleDisplay(member.projectRole);

            return (
              <div
                key={member.user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: isLeader ? 'var(--color-primary-bg)' : 'transparent',
                  border: isLeader ? '1px solid var(--color-primary)' : '1px solid transparent',
                  order: isLeader ? -1 : 0, // ✅ Ensure leader always at top even if sorting fails
                }}
              >
                <UserCard user={member.user} compact />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                }}>
                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: roleInfo.color,
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    backgroundColor: isLeader ? 'var(--color-primary-bg)' : 'var(--color-gray-100)',
                    borderRadius: 'var(--border-radius-full)',
                  }}>
                    {roleInfo.icon} {roleInfo.displayName}
                  </span>
                  {canRemove && (
                    <button
                      onClick={() => handleRemoveMember(member.user.id)}
                      className="btn btn-danger"
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        padding: 'var(--spacing-1) var(--spacing-2)',
                      }}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberList;