import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../components/layout/PageWrapper';
import ProjectCard from '../components/ProjectCard';
import CreateProjectForm from '../components/CreateProjectForm';
import { getAllProjects, getMyProjects } from '../../../api/projectApi/projectApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const ProjectListPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ✅ Role checks - simplified for ADMIN/EMPLOYEE
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (isAdmin) {
        // ✅ ADMIN sees all projects
        response = await getAllProjects();
      } else {
        // ✅ EMPLOYEE sees only their projects
        response = await getMyProjects();
      }
      
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchProjects();
  };

  const handleRefresh = () => {
    fetchProjects();
  };

  // ✅ Get subtitle based on role
  const getSubtitle = () => {
    if (isAdmin) {
      return `${projects.length} project(s) in the system`;
    } else {
      return `${projects.length} project(s) you are part of`;
    }
  };

  // ✅ Get empty state message based on role
  const getEmptyMessage = () => {
    if (isAdmin) {
      return 'No projects in the system. Click "New Project" to create one.';
    } else {
      return "You are not part of any projects yet. Ask your project leader or admin to add you to a project.";
    }
  };

  // ✅ Get role-based action button text
  const getActionMessage = () => {
    if (isAdmin) {
      return 'Create and manage all projects in the system';
    } else {
      return 'View projects you are part of';
    }
  };

  return (
    <PageWrapper
      title="Projects"
      subtitle={getSubtitle()}
      actions={
        <>
          {/* ✅ Only ADMIN can create projects */}
          {isAdmin && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? '✕ Cancel' : '+ New Project'}
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </>
      }
    >
      {/* ✅ Create Project Form - Admin only */}
      {showCreateForm && isAdmin && (
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <CreateProjectForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* ✅ Role info banner */}
      <div style={{
        marginBottom: 'var(--spacing-4)',
        padding: 'var(--spacing-3)',
        backgroundColor: isAdmin ? 'var(--color-primary-bg)' : 'var(--color-gray-50)',
        borderRadius: 'var(--border-radius-md)',
        border: `1px solid ${isAdmin ? 'var(--color-primary)' : 'var(--border-color)'}`,
        fontSize: 'var(--font-size-sm)',
        color: isAdmin ? 'var(--color-primary)' : 'var(--color-gray-600)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
      }}>
        <span>{isAdmin ? '🔑' : '👤'}</span>
        <span>
          {isAdmin 
            ? 'You have Admin access. You can view and manage all projects.' 
            : 'You have Employee access. You can view projects you are part of.'}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
          <button
            onClick={handleRefresh}
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

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading projects...</p>
        </div>
      )}

      {/* Project List */}
      {!loading && !error && (
        <>
          {projects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-2)' }}>
                {getEmptyMessage()}
              </p>
              {!isAdmin && (
                <p style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  color: 'var(--color-gray-400)',
                  marginTop: 'var(--spacing-2)',
                }}>
                  💡 Tip: Only Admins can create projects. Contact your administrator to get started.
                </p>
              )}
              {isAdmin && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateForm(true)}
                  style={{ marginTop: 'var(--spacing-4)' }}
                >
                  + Create First Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default ProjectListPage;