import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import TaskBoard from '../components/TaskBoard';
import CreateTaskForm from '../components/CreateTaskForm';
import {
  getTasksByProject,
  createTask,
  updateTaskStatus,
  assignTask,
  getTaskById
} from '../../../api/taskApi/taskApi';
import { getProjectById } from '../../../api/projectApi/projectApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { isTaskTransitionAllowed } from '../../../utils/constants/taskConstants';

const TaskBoardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isProjectLeader = user?.role === 'EMPLOYEE' && project?.leader?.id === user?.id;
  const canCreateTasks = isAdmin || isProjectLeader;

  useEffect(() => {
    if (projectId) {
      fetchProjectAndTasks();
    }
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectResponse = await getProjectById(projectId);
      setProject(projectResponse.data);
      
      const tasksResponse = await getTasksByProject(projectId);
      
      const tasksWithProject = tasksResponse.data.map(task => ({
        ...task,
        projectId: projectId
      }));
      setTasks(tasksWithProject);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      const response = await createTask(projectId, formData);
      const newTask = {
        ...response.data,
        projectId: projectId
      };
      setTasks(prev => [...prev, newTask]);
      setShowCreateForm(false);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  // ✅ Fixed: handleStatusChange takes taskId and newStatus
  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // ✅ Validate transition
    if (!isTaskTransitionAllowed(task.status, newStatus)) {
      setError(`Cannot transition from ${task.status} to ${newStatus}`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      // ✅ Correct API call: projectId, taskId, newStatus
      await updateTaskStatus(projectId, taskId, newStatus);
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      await assignTask(projectId, taskId, userId);
      // Fetch updated task to get assignee details
      const response = await getTaskById(projectId, taskId);
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...response.data, projectId: projectId } : t
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRefresh = () => {
    fetchProjectAndTasks();
  };

  const handleBackToProject = () => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <PageWrapper
      title="Task Board"
      subtitle={project ? `${tasks.length} tasks in ${project.name}` : 'Loading...'}
      actions={
        <> 
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/projects/${projectId}/issues`)}
            disabled={loading}
            style={{ marginRight: 'var(--spacing-2)' }}
          >
            🐛 View Issues
          </button>
          {canCreateTasks && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? '✕ Cancel' : '+ New Task'}
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleBackToProject}
          >
            ← Back to Project
          </button>
        </>
      }
    >
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
        </div>
      )}

      {showCreateForm && (
        <CreateTaskForm
          projectId={projectId}
          onSuccess={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <TaskBoard
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onAssign={handleAssignTask}
        loading={loading}
      />

      {!loading && tasks.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-4)' }}>
            No tasks in this project yet.
            {canCreateTasks && ' Click "New Task" to create one.'}
          </p>
          {!canCreateTasks && (
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)' }}>
              💡 Only Admins and Project Leaders can create tasks.
            </p>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default TaskBoardPage;