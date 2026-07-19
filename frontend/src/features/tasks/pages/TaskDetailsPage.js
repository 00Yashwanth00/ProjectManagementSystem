// frontend/src/features/tasks/pages/TaskDetailsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import AssignTaskForm from '../components/AssignTaskForm';
import CreateIssueForm from '../../issues/components/CreateIssueForm';
import CommentList from '../../comments/components/CommentList';
import {
  getTaskById,
  updateTaskStatus,
  assignTask,
} from '../../../api/taskApi/taskApi';
import { getProjectById } from '../../../api/projectApi/projectApi';
import { createIssue } from '../../../api/issueApi/issueApi';
import { getTaskComments, addTaskComment } from '../../../api/commentApi/commentApi';
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
  const location = useLocation();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // ✅ Comments State
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isProjectLeader = project?.leader?.id === user?.id;
  const isAssignee = task?.assignee?.id === user?.id;
  const canAssign = isAdmin || isProjectLeader;
  const canUpdateStatus = isAdmin || isProjectLeader || isAssignee;
  const canReportIssue = !isAdmin && (isProjectLeader || isAssignee);

  // ✅ Auto-open issue form if URL has reportIssue=true parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reportIssue') === 'true' && canReportIssue) {
      setShowIssueForm(true);
      navigate(`/projects/${projectId}/tasks/${taskId}`, { replace: true });
    }
  }, [location, canReportIssue, projectId, taskId, navigate]);

  useEffect(() => {
    if (taskId && projectId) {
      fetchTaskAndProject();
      fetchComments();
    }
  }, [taskId, projectId]);

  const fetchTaskAndProject = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const [taskResponse, projectResponse] = await Promise.all([
        getTaskById(projectId, taskId),
        getProjectById(projectId)
      ]);
      
      setTask({ ...taskResponse.data, projectId: projectId });
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

  // ✅ Fetch Comments
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await getTaskComments(taskId);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // ✅ Handle Add Comment
  const handleAddComment = async (content) => {
    const response = await addTaskComment(taskId, content);
    return response.data;
  };

  // ✅ Handle issue creation from task
  const handleCreateIssueFromTask = async (formData) => {
    try {
      const issueData = {
        ...formData,
        taskId: taskId
      };
      
      await createIssue(projectId, issueData);
      setShowIssueForm(false);
      setSuccessMessage('✅ Issue reported successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
      return Promise.resolve();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report issue');
      setTimeout(() => setError(null), 5000);
      return Promise.reject(err);
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
      setSuccessMessage(`✅ Status updated to ${TASK_STATUS_LABELS[newStatus]}`);
      setTimeout(() => setSuccessMessage(null), 3000);
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
      const response = await getTaskById(projectId, taskId);
      setTask({ ...response.data, projectId: projectId });
      setShowAssignForm(false);
      setSuccessMessage('✅ Task assigned successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRefresh = () => {
    fetchTaskAndProject();
    fetchComments();
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

  const getAssigneeColor = () => {
    if (!task?.assignee) return 'var(--color-gray-400)';
    return task.assignee.role === 'ADMIN' ? 'var(--color-danger)' : 'var(--color-primary)';
  };

  const getAssigneeInitial = () => {
    if (!task?.assignee) return '?';
    return task.assignee.name?.charAt(0)?.toUpperCase() || '?';
  };

  const getUserRoleDisplay = () => {
    if (isAdmin) return 'Admin';
    if (isProjectLeader) return 'Project Leader';
    if (isAssignee) return 'Assignee';
    return 'Viewer';
  };

  return (
    <PageWrapper
      title={task?.title || 'Task Details'}
      subtitle={task ? `Status: ${TASK_STATUS_LABELS[task.status]}` : 'Loading...'}
      actions={
        <>
          {canReportIssue && (
            <button
              className="btn btn-danger"
              onClick={() => {
                setShowIssueForm(!showIssueForm);
                if (!showIssueForm) {
                  setError(null);
                  setSuccessMessage(null);
                }
              }}
              disabled={loading}
              style={{ marginRight: 'var(--spacing-2)' }}
            >
              🐛 {showIssueForm ? 'Cancel' : 'Report Issue'}
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

      {successMessage && !loading && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--spacing-4)' }}>
          {successMessage}
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: 'var(--spacing-2)',
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {!loading && !error && task && (
        <div>
          {showIssueForm && (
            <CreateIssueForm
              projectId={projectId}
              preSelectedTaskId={taskId}
              preSelectedTaskTitle={task.title}
              onSuccess={handleCreateIssueFromTask}
              onCancel={() => {
                setShowIssueForm(false);
                setError(null);
              }}
            />
          )}

          {/* Task Details Card */}
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
              
              {/* Assignee Section */}
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
                          {task.assignee.name}
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-gray-500)',
                        }}>
                          {task.assignee.email}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-gray-500)',
                      fontStyle: 'italic',
                    }}>
                      Not assigned
                    </span>
                  )}
                  
                  {canAssign && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setShowAssignForm(!showAssignForm);
                        if (!showAssignForm) {
                          setError(null);
                          setSuccessMessage(null);
                        }
                      }}
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

              {/* Project Info */}
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Project
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-gray-900)',
                }}>
                  {project?.name || 'N/A'}
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

          {/* Status Update Section */}
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
              <div style={{
                marginTop: 'var(--spacing-2)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-gray-400)',
                borderTop: 'var(--border-width) solid var(--border-color)',
                paddingTop: 'var(--spacing-2)',
              }}>
                💡 Allowed transitions: 
                {task.status === TASK_STATUS.TODO && ' TODO → IN_PROGRESS, DONE'}
                {task.status === TASK_STATUS.IN_PROGRESS && ' IN_PROGRESS → DONE'}
                {task.status === TASK_STATUS.DONE && ' None (Task completed)'}
              </div>
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

          {/* ✅ Comments Section */}
          <CommentList
            comments={comments}
            currentUserId={user?.id}
            onAddComment={handleAddComment}
            onCommentUpdated={fetchComments}
            loading={commentsLoading}
            targetType="task"
            targetId={taskId}
          />

          {/* Role-based info */}
          <div style={{
            marginTop: 'var(--spacing-4)',
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: 'var(--border-radius-md)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-600)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-1)',
          }}>
            <div>
              <strong>Your Role: </strong>
              <span style={{
                fontWeight: 'var(--font-weight-medium)',
                color: isAdmin ? 'var(--color-danger)' : 
                       isProjectLeader ? 'var(--color-primary)' : 
                       isAssignee ? 'var(--color-success)' :
                       'var(--color-gray-600)',
              }}>
                {getUserRoleDisplay()}
              </span>
            </div>
            {canUpdateStatus ? (
              <span>✅ You can update task status</span>
            ) : (
              <span>ℹ️ You have view-only access to this task</span>
            )}
            {canAssign && (
              <div>
                <span>✅ You can assign this task to others</span>
              </div>
            )}
            {canReportIssue && (
              <div>
                <span>🐛 You can report an issue for this task</span>
              </div>
            )}
            {isAdmin && (
              <div>
                <span>ℹ️ Admin can view and update status but cannot report issues</span>
              </div>
            )}
            {!isAdmin && !isProjectLeader && !isAssignee && (
              <div>
                <span>👁️ You are viewing this task as a project member</span>
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default TaskDetailsPage;