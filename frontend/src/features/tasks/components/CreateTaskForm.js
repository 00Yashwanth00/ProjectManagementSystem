import React, { useState } from 'react';
import ProjectMemberSelect from '../../users/components/ProjectMemberSelect';
import { TASK_PRIORITY_LABELS } from '../../../utils/constants/taskConstants';

const CreateTaskForm = ({ projectId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeId: '',  // ✅ This will be sent to backend
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      // ✅ Send the entire formData including assigneeId
      await onSuccess(formData);
      setLoading(false);
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        assigneeId: '',
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
      <h3 style={{ marginBottom: 'var(--spacing-4)' }}>Create New Task</h3>
      
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label
            htmlFor="task-title"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-1)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Task Title <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            id="task-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label
            htmlFor="task-description"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-1)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            style={{ width: '100%', minHeight: '80px' }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label
            htmlFor="task-priority"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-1)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Priority
          </label>
          <select
            id="task-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{ width: '100%' }}
            disabled={loading}
          >
            {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* ✅ ProjectMemberSelect for assigning during creation */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <ProjectMemberSelect
            projectId={projectId}
            label="Assign To (Optional)"
            value={formData.assigneeId}
            onChange={(userId) => setFormData(prev => ({ ...prev, assigneeId: userId }))}
            placeholder="Select a team member (optional)"
            disabled={loading}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: 'var(--spacing-2)',
          justifyContent: 'flex-end',
          marginTop: 'var(--spacing-4)',
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
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;