// frontend/src/features/issues/components/CreateIssueForm.js

import React, { useState, useEffect } from 'react';
import ProjectMemberSelect from '../../users/components/ProjectMemberSelect';
import { getTasksByProject } from '../../../api/taskApi/taskApi';
import {
  ISSUE_PRIORITY_LABELS,
  ISSUE_TYPE_LABELS,
} from '../../../utils/constants/issueConstants';

const CreateIssueForm = ({ 
  projectId, 
  onSuccess, 
  onCancel, 
  preSelectedTaskId = null,
  preSelectedTaskTitle = null
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'BUG',
    priority: 'MEDIUM',
    taskId: preSelectedTaskId || '',
    assigneeId: '',
  });
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load tasks when component mounts for task linking
  useEffect(() => {
    if (projectId && !preSelectedTaskId) {
      fetchTasks();
    }
  }, [projectId, preSelectedTaskId]);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await getTasksByProject(projectId);
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Issue title is required');
      return;
    }

    try {
      setLoading(true);
      await onSuccess(formData);
      setLoading(false);
      setFormData({
        title: '',
        description: '',
        type: 'BUG',
        priority: 'MEDIUM',
        taskId: '',
        assigneeId: '',
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to create issue');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Get task status badge color
  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'TODO':
        return 'var(--color-gray-500)';
      case 'IN_PROGRESS':
        return 'var(--color-warning)';
      case 'DONE':
        return 'var(--color-success)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  // ✅ Get task status label
  const getTaskStatusLabel = (status) => {
    switch (status) {
      case 'TODO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
      <h3 style={{ marginBottom: 'var(--spacing-4)' }}>
        {preSelectedTaskId ? 'Report Issue for Task' : 'Create New Issue'}
      </h3>
      
      {/* ✅ Show linked task info if pre-selected */}
      {preSelectedTaskId && preSelectedTaskTitle && (
        <div style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-primary-bg)',
          borderRadius: 'var(--border-radius-md)',
          marginBottom: 'var(--spacing-4)',
          border: '1px solid var(--color-primary)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--spacing-1)',
          }}>
            🔗 Linked Task
          </div>
          <div style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-gray-900)',
          }}>
            {preSelectedTaskTitle}
          </div>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-gray-500)',
            marginTop: 'var(--spacing-1)',
          }}>
            This issue will be linked to the above task automatically
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label
            htmlFor="issue-title"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-1)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Issue Title <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            id="issue-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="What's the issue?"
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label
            htmlFor="issue-description"
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
            id="issue-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            style={{ width: '100%', minHeight: '80px' }}
            disabled={loading}
          />
        </div>

        {/* Type */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label
            htmlFor="issue-type"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-1)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Type
          </label>
          <select
            id="issue-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{ width: '100%' }}
            disabled={loading}
          >
            {Object.entries(ISSUE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label
            htmlFor="issue-priority"
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
            id="issue-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{ width: '100%' }}
            disabled={loading}
          >
            {Object.entries(ISSUE_PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* ✅ Link Task - Dropdown instead of text input */}
        {!preSelectedTaskId && (
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label
              htmlFor="issue-task"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-1)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Link Task (Optional)
            </label>
            <select
              id="issue-task"
              name="taskId"
              value={formData.taskId}
              onChange={handleChange}
              style={{ width: '100%' }}
              disabled={loading || loadingTasks}
            >
              <option value="">None</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} 
                  {task.assignee ? ` (👤 ${task.assignee.name})` : ''}
                  {' - '}
                  {getTaskStatusLabel(task.status)}
                </option>
              ))}
            </select>
            {loadingTasks && (
              <div style={{
                marginTop: 'var(--spacing-1)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-gray-500)',
              }}>
                Loading tasks...
              </div>
            )}
            {!loadingTasks && tasks.length === 0 && (
              <div style={{
                marginTop: 'var(--spacing-1)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-gray-400)',
              }}>
                💡 No tasks available in this project yet
              </div>
            )}
            {!loadingTasks && tasks.length > 0 && (
              <div style={{
                marginTop: 'var(--spacing-1)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-gray-400)',
              }}>
                💡 Select a task to link this issue to
              </div>
            )}
          </div>
        )}

        {/* Assign To (Optional) */}
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

        {/* Actions */}
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
            {loading ? 'Creating...' : preSelectedTaskId ? 'Report Issue' : 'Create Issue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIssueForm;