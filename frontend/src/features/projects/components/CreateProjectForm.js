import React, { useState } from 'react';
import UserSelect from '../../users/components/UserSelect';
import { createProject } from '../../../api/projectApi/projectApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const CreateProjectForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    leaderId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Only ADMIN can create projects
  const isAdmin = user?.role === 'ADMIN';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!formData.leaderId) {
      setError('Please select a project leader');
      return;
    }

    try {
      setLoading(true);
      await createProject(formData);
      setLoading(false);
      setFormData({ name: '', leaderId: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
        <p style={{ color: 'var(--color-danger)' }}>⛔ Only Admins can create projects</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
      <h3 style={{ marginBottom: 'var(--spacing-4)' }}>Create New Project</h3>
      
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Project Name */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label
            htmlFor="project-name"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-1)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Project Name <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            id="project-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>

        {/* Project Leader - Only EMPLOYEE users can be leaders */}
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <UserSelect
            label="Project Leader"
            value={formData.leaderId}
            onChange={(userId) => setFormData(prev => ({ ...prev, leaderId: userId }))}
            placeholder="Select a project leader"
            required={true}
            disabled={loading}
            excludeAdmins={true}  // ✅ Exclude ADMIN users from leader selection
          />
          <div style={{
            marginTop: 'var(--spacing-1)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-gray-500)',
          }}>
            💡 Only Employee users can be assigned as project leaders
          </div>
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
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;