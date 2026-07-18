import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import AssignTaskForm from '../components/AssignTaskForm';
import {
  getTaskById,
  updateTaskStatus,
  assignTask,
} from '../../../api/taskApi/taskApi';
import { getProjectById } from '../../../api/projectApi/projectApi';
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
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ✅ Check if user is ADMIN (system role)
  const isAdmin = user?.role === 'ADMIN';
  
  // ✅ Check if user is PROJECT_LEADER (derived from project_members)
  const isProjectLeader = project?.leader?.id === user?.id;
  
  // ✅ Permissions
  const canAssign = isAdmin || isProjectLeader;
  const canUpdateStatus = isAdmin || isProjectLeader || task?.assignee?.id === user?.id;

  useEffect(() => {
    if (taskId && projectId) {
      fetchTaskAndProject();
    }
  }, [taskId, projectId]);

  const fetchTaskAndProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Fetch both task and project details
      const [taskResponse, projectResponse] = await Promise.all([
        getTaskById(projectId, taskId),
        getProjectById(projectId)
      ]);
      
      setTask(taskResponse.data);
      setProject(projectResponse.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      if (err.response?.status === 404) {
        setError('Task or Project not found');
      } else {
        setError(err.response?.data?.message || 'Failed to load task details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!task) return;

    if (!isTaskTransitionAllowed(task.status, newStatus)) {
      setError(`Cannot transition from ${task.status} to ${newStatus}`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setUpdating(true);
      await updateTaskStatus(projectId, taskId, newStatus);
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
      await assignTask(projectId, taskId, userId);
      // ✅ After assignment, fetch updated task to get full assignee details
      const response = await getTaskById(projectId, taskId);
      setTask(response.data);
      setShowAssignForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRefresh = () => {
    fetchTaskAndProject();
  };

  const handleBack = () => {
    navigate(`/projects/${projectId}/tasks`);
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

  // ✅ Get assignee display name
  const getAssigneeDisplay = () => {
    if (!task?.assignee) return 'Not assigned';
    const assignee = task.assignee;
    return `${assignee.name} (${assignee.email})`;
  };

  // ✅ Get assignee avatar color
  const getAssigneeColor = () => {
    if (!task?.assignee) return 'var(--color-gray-400)';
    return task.assignee.role === 'ADMIN' ? 'var(--color-danger)' : 'var(--color-primary)';
  };

  // ✅ Get assignee initial
  const getAssigneeInitial = () => {
    if (!task?.assignee) return '?';
    return task.assignee.name?.charAt(0)?.toUpperCase() || '?';
  };

  // ✅ Get user's role display
  const getUserRoleDisplay = () => {
    if (isAdmin) return 'Admin';
    if (isProjectLeader) return 'Project Leader';
    return 'Team Member';
  };

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
            onClick={handleBack}
          >
            ← Back to Tasks
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
              
              {/* ✅ Enhanced Assignee Section with Identity Display */}
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
                  gap: 'var(--spacing-3)',
                  flexWrap: 'wrap',
                }}>
                  {task.assignee ? (
                    <>
                      {/* ✅ Assignee Avatar */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--border-radius-full)',
                          backgroundColor: getAssigneeColor(),
                          color: 'var(--color-white)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'var(--font-weight-bold)',
                          fontSize: 'var(--font-size-sm)',
                          flexShrink: 0,
                        }}>
                          {getAssigneeInitial()}
                        </div>
                        <div>
                          <div style={{
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-gray-900)',
                          }}>
                            {task.assignee.name || 'Unknown User'}
                          </div>
                          <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-gray-500)',
                          }}>
                            {task.assignee.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-gray-500)',
                      fontStyle: 'italic',
                    }}>
                      Not assigned
                    </span>
                  )}
                  
                  {/* Assign Button - Only for ADMIN and PROJECT_LEADER */}
                  {canAssign && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAssignForm(!showAssignForm)}
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        padding: 'var(--spacing-1) var(--spacing-3)',
                      }}
                    >
                      {showAssignForm ? 'Cancel' : (task.assignee ? 'Change Assignee' : 'Assign')}
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

          {/* ✅ Status Update Section - Shows to ADMIN, PROJECT_LEADER, and Assignee */}
          {canUpdateStatus && (
            <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>
                Update Status
                <span style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--color-gray-500)',
                  marginLeft: 'var(--spacing-2)',
                }}>
                  ({isAdmin ? 'Admin' : isProjectLeader ? 'Project Leader' : 'Assignee'})
                </span>
              </h4>
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
              {/* ✅ Show who can update status */}
              <div style={{
                marginTop: 'var(--spacing-2)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-gray-500)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: 'var(--spacing-2)',
              }}>
                <span>👤 </span>
                {isAdmin && <span>Admin • </span>}
                {isProjectLeader && <span>Project Leader • </span>}
                {task.assignee?.id === user?.id && <span>Assignee • </span>}
                <span style={{ color: 'var(--color-gray-400)' }}>
                  {!isAdmin && !isProjectLeader && task.assignee?.id !== user?.id && 'View only'}
                </span>
              </div>
            </div>
          )}

          {/* ✅ If user cannot update status, show message */}
          {!canUpdateStatus && (
            <div className="card" style={{ marginBottom: 'var(--spacing-4)', backgroundColor: 'var(--color-gray-50)' }}>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-gray-500)',
                textAlign: 'center',
                margin: 0,
              }}>
                ℹ️ You have view-only access. Only Admin, Project Leader, or the Assignee can change status.
              </p>
            </div>
          )}

          {showAssignForm && (
            <AssignTaskForm
              task={task}
              projectId={projectId}
              onAssign={handleAssign}
              onCancel={() => setShowAssignForm(false)}
            />
          )}

          <div style={{
            marginTop: 'var(--spacing-4)',
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: 'var(--border-radius-md)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-600)',
          }}>
            <div>
              <strong>Your Role: </strong>
              <span style={{
                fontWeight: 'var(--font-weight-medium)',
                color: isAdmin ? 'var(--color-danger)' : 
                       isProjectLeader ? 'var(--color-primary)' : 
                       'var(--color-gray-600)',
              }}>
                {getUserRoleDisplay()}
              </span>
            </div>
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