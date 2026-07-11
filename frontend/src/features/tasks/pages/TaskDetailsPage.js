import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import AssignTaskForm from '../components/AssignTaskForm';
import {
  getTaskById,
  updateTaskStatus,
  assignTask,
} from '../../../api/taskApi/taskApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import {
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
  TASK_STATUS_COLORS,
  isTaskTransitionAllowed,
  TASK_STATUS,
} from '../../../utils/constants/taskConstants';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isProjectLeader = user?.role === 'PROJECT_LEADER';
  const canAssign = isAdmin || isProjectLeader;
  const canUpdateStatus = isAdmin || isProjectLeader || task?.assignee?.id === user?.id;

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTaskById(taskId);
      setTask(response.data);
    } catch (err) {
      console.error('Failed to fetch task:', err);
      if (err.response?.status === 404) {
        setError('Task not found');
      } else {
        setError(err.response?.data?.message || 'Failed to load task details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!task) return;

    // ✅ Client-side validation
    if (!isTaskTransitionAllowed(task.status, newStatus)) {
      setError(`Cannot transition from ${task.status} to ${newStatus}`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setUpdating(true);
      await updateTaskStatus(taskId, newStatus);
      setTask(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async (userId) => {
    try {
      await assignTask(taskId, userId);
      setTask(prev => ({ 
        ...prev, 
        assignee: { id: userId, name: 'Assigned User' } 
      }));
      setShowAssignForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRefresh = () => {
    fetchTask();
  };

  const getStatusBadge = (status) => ({
    backgroundColor: TASK_STATUS_COLORS[status] || 'var(--color-gray-400)',
    color: 'var(--color-white)',
    padding: 'var(--spacing-1) var(--spacing-3)',
    borderRadius: 'var(--border-radius-full)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    display: 'inline-block',
  });

  const getPriorityStyle = (priority) => ({
    color: TASK_PRIORITY_COLORS[priority],
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-base)',
  });

  return (
    <PageWrapper
      title={task?.title || 'Task Details'}
      subtitle={task ? `Status: ${TASK_STATUS_LABELS[task.status]}` : 'Loading...'}
      actions={
        <>
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </>
      }
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading task details...</p>
        </div>
      )}

      {error && !loading && (
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

      {!loading && !error && task && (
        <div>
          {/* Task Info */}
          <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-4)',
            }}>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Title
                </div>
                <div style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-gray-900)',
                }}>
                  {task.title}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Status
                </div>
                <span style={getStatusBadge(task.status)}>
                  {TASK_STATUS_LABELS[task.status]}
                </span>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Priority
                </div>
                <div style={getPriorityStyle(task.priority)}>
                  {TASK_PRIORITY_LABELS[task.priority]}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Assignee
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                }}>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-gray-900)',
                  }}>
                    {task.assignee?.name || 'Not assigned'}
                  </span>
                  {canAssign && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAssignForm(!showAssignForm)}
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        padding: 'var(--spacing-1) var(--spacing-2)',
                      }}
                    >
                      {showAssignForm ? 'Cancel' : 'Assign'}
                    </button>
                  )}
                </div>
              </div>
              {task.description && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-gray-500)',
                    marginBottom: 'var(--spacing-1)',
                  }}>
                    Description
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-gray-700)',
                    lineHeight: '1.6',
                  }}>
                    {task.description}
                  </div>
                </div>
              )}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Created At
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-700)',
                }}>
                  {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Actions */}
          {canUpdateStatus && (
            <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Update Status</h4>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {Object.entries(TASK_STATUS_LABELS).map(([status, label]) => {
                  const isCurrent = task.status === status;
                  const isAllowed = isTaskTransitionAllowed(task.status, status);
                  const disabled = isCurrent || !isAllowed || updating;

                  return (
                    <button
                      key={status}
                      className={isCurrent ? 'btn btn-primary' : 'btn btn-secondary'}
                      onClick={() => handleStatusChange(status)}
                      disabled={disabled}
                      style={{
                        opacity: disabled ? 0.5 : 1,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {label}
                      {!isAllowed && status !== task.status && ' 🔒'}
                    </button>
                  );
                })}
              </div>
              {task.status === TASK_STATUS.DONE && (
                <div style={{
                  marginTop: 'var(--spacing-2)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-success)',
                }}>
                  ✅ Task completed! No further transitions allowed.
                </div>
              )}
            </div>
          )}

          {/* Assign Form */}
          {showAssignForm && (
            <AssignTaskForm
              task={task}
              onAssign={handleAssign}
              onCancel={() => setShowAssignForm(false)}
            />
          )}

          {/* Role-based info */}
          <div style={{
            marginTop: 'var(--spacing-4)',
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: 'var(--border-radius-md)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-600)',
          }}>
            {canUpdateStatus ? (
              <span>✅ You can update task status (Admin, Project Leader, or Assignee)</span>
            ) : (
              <span>ℹ️ You have view-only access to this task</span>
            )}
            {canAssign && (
              <div style={{ marginTop: 'var(--spacing-1)' }}>
                <span>✅ You can assign this task to others</span>
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default TaskDetailsPage;