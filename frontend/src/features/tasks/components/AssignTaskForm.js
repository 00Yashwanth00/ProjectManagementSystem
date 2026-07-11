import React, { useState } from 'react';
import UserSelect from '../../users/components/UserSelect';

const AssignTaskForm = ({ task, onAssign, onCancel }) => {
  const [selectedUserId, setSelectedUserId] = useState(task?.assignee?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedUserId) {
      setError('Please select a user to assign');
      return;
    }

    try {
      setLoading(true);
      await onAssign(selectedUserId);
      setLoading(false);
      onCancel();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to assign task');
    }
  };

  return (
    <div style={{
      padding: 'var(--spacing-4)',
      backgroundColor: 'var(--color-gray-50)',
      borderRadius: 'var(--border-radius-md)',
      marginTop: 'var(--spacing-4)',
    }}>
      <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Assign Task</h4>
      
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <UserSelect
          label="Select User"
          value={selectedUserId}
          onChange={setSelectedUserId}
          placeholder="Search users..."
          disabled={loading}
          required
        />
        
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-2)',
          justifyContent: 'flex-end',
          marginTop: 'var(--spacing-3)',
        }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !selectedUserId}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignTaskForm;