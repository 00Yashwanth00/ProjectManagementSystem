import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { getMyProjects } from '../../../api/projectApi/projectApi';
import { getTasksByProject } from '../../../api/taskApi/taskApi';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [taskStats, setTaskStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Role checks
  const isAdmin = user?.role === 'ADMIN';
  const isEmployee = user?.role === 'EMPLOYEE';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's projects
      const projectsResponse = await getMyProjects();
      setProjects(projectsResponse.data);

      // Get task statistics for all projects
      let totalTasks = 0;
      let todo = 0;
      let inProgress = 0;
      let done = 0;

      for (const project of projectsResponse.data) {
        try {
          const tasksResponse = await getTasksByProject(project.id);
          const tasks = tasksResponse.data;
          totalTasks += tasks.length;
          todo += tasks.filter(t => t.status === 'TODO').length;
          inProgress += tasks.filter(t => t.status === 'IN_PROGRESS').length;
          done += tasks.filter(t => t.status === 'DONE').length;
        } catch (err) {
          console.error(`Failed to fetch tasks for project ${project.id}:`, err);
        }
      }

      setTaskStats({ total: totalTasks, todo, inProgress, done });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // ✅ Admin Dashboard
  if (isAdmin) {
    return (
      <PageWrapper
        title="Admin Dashboard"
        subtitle="Overview of the entire system"
        actions={
          <>
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
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ marginBottom: 'var(--spacing-6)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
              {projects.length}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>My Projects</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
              {taskStats.todo}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Tasks To Do</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
              {taskStats.inProgress}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>In Progress</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
              {taskStats.done}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Completed</div>
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: 'var(--spacing-6)' }}>
          <div 
            className="card" 
            style={{ 
              cursor: 'pointer',
              transition: 'transform var(--transition-fast)',
            }}
            onClick={() => navigate('/projects')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h4>📁 Manage Projects</h4>
            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
              Create and manage all projects in the system
            </p>
          </div>
          <div 
            className="card" 
            style={{ 
              cursor: 'pointer',
              transition: 'transform var(--transition-fast)',
            }}
            onClick={() => navigate('/users')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h4>👥 Manage Users</h4>
            <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
              View and manage all users in the system
            </p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card">
          <h4 style={{ marginBottom: 'var(--spacing-4)' }}>Your Projects</h4>
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: 'var(--color-gray-500)' }}>You are not part of any projects yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--spacing-2)',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{project.name}</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }

  // ✅ Employee Dashboard
  return (
    <PageWrapper
      title="My Dashboard"
      subtitle={`Welcome back, ${user?.name || 'User'}!`}
      actions={
        <>
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
      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
            {projects.length}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>My Projects</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
            {taskStats.todo}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Tasks To Do</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
            {taskStats.inProgress}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>In Progress</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
            {taskStats.done}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>Completed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div
            className="card"
            style={{ 
              cursor: 'pointer',
              transition: 'transform var(--transition-fast)',
              backgroundColor: 'var(--color-primary-bg)',
              border: '1px solid var(--color-primary)',
            }}
            onClick={() => navigate('/projects')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h4 style={{ color: 'var(--color-primary)' }}>📁 My Projects</h4>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
              View all projects you are part of
            </p>
          </div>
        </div>
      </div>

      {/* My Projects */}
      <div className="card">
        <h4 style={{ marginBottom: 'var(--spacing-4)' }}>My Projects</h4>
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
            <p style={{ color: 'var(--color-gray-500)' }}>You are not part of any projects yet.</p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)' }}>
              Ask your project leader or admin to add you to a project.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                  border: '1px solid var(--border-color)',
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{project.name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                    Leader: {project.leader?.name || 'Not assigned'}
                  </div>
                </div>
                <span style={{
                  backgroundColor: project.status === 'ACTIVE' ? 'var(--color-success-bg)' : 'var(--color-gray-100)',
                  color: project.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-gray-500)',
                  padding: 'var(--spacing-1) var(--spacing-3)',
                  borderRadius: 'var(--border-radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;