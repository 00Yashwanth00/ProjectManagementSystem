import React, { useState, useEffect } from 'react';
import UserSelect from '../../users/components/UserSelect';
import { updateProjectLeader } from '../../../api/projectApi/projectApi';
import { getAllUsers } from '../../../api/userApi/userApi';

const ChangeLeaderModal = ({ project, onClose, onSuccess }) => {
  const [selectedLeaderId, setSelectedLeaderId] = useState(project?.leader?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch all users to show in the dropdown
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLeaderId) {
      setError('Please select a project leader');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updateProjectLeader(project.id, selectedLeaderId);
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to update project leader');
    }
  };

  // Get current leader name
  const currentLeaderName = project?.leader?.name || 'Not assigned';

  // Get selected user details
  const selectedUser = users.find(u => u.id === selectedLeaderId);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 'var(--z-modal)',
      padding: 'var(--spacing-4)',
    }} onClick={onClose}>
      <div 
        className="card"
        style={{
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-4)',
        }}>
          <h3 style={{ margin: 0 }}>Change Project Leader</h3>
          <button
            onClick={onClose}
            style={{
              fontSize: 'var(--font-size-2xl)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-gray-500)',
              padding: '0 var(--spacing-2)',
            }}
          >
            ×
          </button>
        </div>

        {/* Current Leader Info */}
        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-gray-50)',
          borderRadius: 'var(--border-radius-md)',
          marginBottom: 'var(--spacing-4)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--spacing-1)',
          }}>
            Current Leader
          </div>
          <div style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-gray-900)',
          }}>
            {currentLeaderName}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <UserSelect
              label="New Project Leader"
              value={selectedLeaderId}
              onChange={setSelectedLeaderId}
              placeholder="Select a new leader..."
              required={true}
              disabled={loading}
            />
          </div>

          {/* Selected User Preview */}
          {selectedUser && (
            <div style={{
              padding: 'var(--spacing-3)',
              backgroundColor: 'var(--color-primary-bg)',
              borderRadius: 'var(--border-radius-md)',
              marginBottom: 'var(--spacing-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--border-radius-full)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'var(--font-weight-bold)',
                fontSize: 'var(--font-size-lg)',
              }}>
                {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-gray-900)',
                }}>
                  {selectedUser.name}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                }}>
                  {selectedUser.email} • {selectedUser.role}
                </div>
              </div>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: 'var(--spacing-2)',
            justifyContent: 'flex-end',
            marginTop: 'var(--spacing-4)',
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !selectedLeaderId}
            >
              {loading ? 'Updating...' : 'Update Leader'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeLeaderModal;