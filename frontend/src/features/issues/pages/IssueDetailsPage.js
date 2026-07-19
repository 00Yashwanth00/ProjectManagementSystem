// frontend/src/features/issues/pages/IssueDetailsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import ProjectMemberSelect from '../../users/components/ProjectMemberSelect';
import {
  getIssueById,
  updateIssueStatus,
  assignIssue,
} from '../../../api/issueApi/issueApi';
import { getProjectById } from '../../../api/projectApi/projectApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import {
  ISSUE_STATUS_LABELS,
  ISSUE_PRIORITY_LABELS,
  ISSUE_PRIORITY_COLORS,
  ISSUE_STATUS_COLORS,
  ISSUE_TYPE_LABELS,
  isIssueTransitionAllowed,
  ISSUE_STATUS,
} from '../../../utils/constants/issueConstants';

const IssueDetailsPage = () => {
  const { projectId, issueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ✅ Role checks
  const isAdmin = user?.role === 'ADMIN';
  const isProjectLeader = project?.leader?.id === user?.id;
  const isAssignee = issue?.assignee?.id === user?.id;
  const isTeamMember = project?.members?.some(m => m.user?.id === user?.id);

  // ✅ Permissions
  const canAssign = isProjectLeader; // Only PROJECT_LEADER can assign
  const canUpdateStatus = isAdmin || isProjectLeader || isAssignee; // ADMIN, PROJECT_LEADER, or ASSIGNEE

  useEffect(() => {
    if (issueId && projectId) {
      fetchIssueAndProject();
    }
  }, [issueId, projectId]);

  const fetchIssueAndProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [issueResponse, projectResponse] = await Promise.all([
        getIssueById(projectId, issueId),
        getProjectById(projectId)
      ]);
      
      setIssue({ ...issueResponse.data, projectId: projectId });
      setProject(projectResponse.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      if (err.response?.status === 404) {
        setError('Issue or Project not found');
      } else {
        setError(err.response?.data?.message || 'Failed to load issue details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!issue) return;

    if (!isIssueTransitionAllowed(issue.status, newStatus)) {
      setError(`Cannot transition from ${issue.status} to ${newStatus}`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setUpdating(true);
      await updateIssueStatus(projectId, issueId, newStatus);
      setIssue(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId) {
      setError('Please select a team member to assign');
      return;
    }

    try {
      setAssigning(true);
      setError(null);
      await assignIssue(projectId, issueId, selectedUserId);
      const response = await getIssueById(projectId, issueId);
      setIssue({ ...response.data, projectId: projectId });
      setShowAssignForm(false);
      setSelectedUserId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign issue');
      setTimeout(() => setError(null), 3000);
    } finally {
      setAssigning(false);
    }
  };

  const handleRefresh = () => {
    fetchIssueAndProject();
  };

  const handleBack = () => {
    navigate(`/projects/${projectId}/issues`);
  };

  const getStatusBadge = (status) => ({
    backgroundColor: ISSUE_STATUS_COLORS[status] || 'var(--color-gray-400)',
    color: 'var(--color-white)',
    padding: 'var(--spacing-1) var(--spacing-3)',
    borderRadius: 'var(--border-radius-full)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    display: 'inline-block',
  });

  const getPriorityStyle = (priority) => ({
    color: ISSUE_PRIORITY_COLORS[priority],
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-base)',
  });

  const getAssigneeColor = () => {
    if (!issue?.assignee) return 'var(--color-gray-400)';
    return issue.assignee.role === 'ADMIN' ? 'var(--color-danger)' : 'var(--color-primary)';
  };

  const getAssigneeInitial = () => {
    if (!issue?.assignee) return '?';
    return issue.assignee.name?.charAt(0)?.toUpperCase() || '?';
  };

  // ✅ Get user's role display
  const getUserRoleDisplay = () => {
    if (isAdmin) return 'Admin';
    if (isProjectLeader) return 'Project Leader';
    if (isAssignee) return 'Assignee';
    if (isTeamMember) return 'Team Member';
    return 'Viewer';
  };

  return (
    <PageWrapper
      title={issue?.title || 'Issue Details'}
      subtitle={issue ? `Status: ${ISSUE_STATUS_LABELS[issue.status]}` : 'Loading...'}
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
            ← Back to Issues
          </button>
        </>
      }
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading issue details...</p>
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

      {!loading && !error && issue && (
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
                  {issue.title}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Type
                </div>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  {ISSUE_TYPE_LABELS[issue.type] || issue.type}
                </span>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Status
                </div>
                <span style={getStatusBadge(issue.status)}>
                  {ISSUE_STATUS_LABELS[issue.status]}
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
                <div style={getPriorityStyle(issue.priority)}>
                  {ISSUE_PRIORITY_LABELS[issue.priority]}
                </div>
              </div>

              {/* Reporter */}
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Reported By
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-gray-900)',
                }}>
                  {issue.reporter?.name || 'Unknown'}
                </div>
              </div>
              
              {/* Assignee Section - Only PROJECT_LEADER can assign */}
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
                  {issue.assignee ? (
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
                          {issue.assignee.name}
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-gray-500)',
                        }}>
                          {issue.assignee.email}
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
                  
                  {/* ✅ Assign button only for PROJECT_LEADER */}
                  {canAssign && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAssignForm(!showAssignForm)}
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        padding: 'var(--spacing-1) var(--spacing-3)',
                      }}
                    >
                      {showAssignForm ? 'Cancel' : (issue.assignee ? 'Change Assignee' : 'Assign')}
                    </button>
                  )}
                </div>
              </div>

              {/* Linked Task */}
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Linked Task
                </div>
                {issue.taskId ? (
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/projects/${projectId}/tasks/${issue.taskId}`)}
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      padding: 'var(--spacing-1) var(--spacing-3)',
                    }}
                  >
                    🔗 View Task
                  </button>
                ) : (
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-gray-500)',
                    fontStyle: 'italic',
                  }}>
                    No task linked
                  </span>
                )}
              </div>

              {issue.description && (
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
                    {issue.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Assign Form - Only for PROJECT_LEADER */}
          {showAssignForm && (
            <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-3)' }}>Assign Issue to Team Member</h4>
              <ProjectMemberSelect
                projectId={projectId}
                label="Select Team Member"
                value={selectedUserId}
                onChange={setSelectedUserId}
                placeholder="Search team members..."
                disabled={assigning}
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
                  onClick={() => setShowAssignForm(false)}
                  disabled={assigning}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAssign}
                  disabled={assigning || !selectedUserId}
                >
                  {assigning ? 'Assigning...' : 'Assign Issue'}
                </button>
              </div>
            </div>
          )}

          {/* ✅ Status Update Section - ADMIN, PROJECT_LEADER, or ASSIGNEE */}
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
                {Object.entries(ISSUE_STATUS_LABELS).map(([status, label]) => {
                  const isCurrent = issue.status === status;
                  const isAllowed = isIssueTransitionAllowed(issue.status, status);
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
                      {!isAllowed && status !== issue.status && ' 🔒'}
                    </button>
                  );
                })}
              </div>
              {issue.status === ISSUE_STATUS.CLOSED && (
                <div style={{
                  marginTop: 'var(--spacing-2)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-success)',
                }}>
                  ✅ Issue closed! No further transitions allowed.
                </div>
              )}
            </div>
          )}

          {/* ✅ If user cannot update status */}
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

          {/* Role Info */}
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
                       isAssignee ? 'var(--color-success)' :
                       'var(--color-gray-600)',
              }}>
                {getUserRoleDisplay()}
              </span>
            </div>
            {canUpdateStatus ? (
              <span>✅ You can update issue status</span>
            ) : (
              <span>ℹ️ You have view-only access to this issue</span>
            )}
            {canAssign && (
              <div style={{ marginTop: 'var(--spacing-1)' }}>
                <span>✅ You can assign this issue to others (Project Leader only)</span>
              </div>
            )}
            {isAdmin && (
              <div style={{ marginTop: 'var(--spacing-1)' }}>
                <span>ℹ️ Admin can view and update status but cannot create or assign issues</span>
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default IssueDetailsPage;