import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import MemberList from '../components/MemberList';
import ChangeLeaderModal from '../components/ChangeLeaderModal';
import { getProjectById } from '../../../api/projectApi/projectApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangeLeaderModal, setShowChangeLeaderModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Only ADMIN can manage members and change leader
  const isAdmin = user?.role === 'ADMIN';
  const isProjectLeader = user?.role === 'EMPLOYEE' && project?.leader?.id === user?.id;
  const isTeamMember =
    user?.role === 'EMPLOYEE' &&
    !isProjectLeader &&
    project?.members?.some(m => m.user.id === user?.id);

  // ✅ Permissions - Only ADMIN can manage members
  const canManageMembers = isAdmin;  // ✅ CHANGED: Only ADMIN
  const canChangeLeader = isAdmin;   // ✅ Only ADMIN

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, refreshKey]);

  const fetchProject = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjectById(id);
      setProject(response.data);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      if (err.response?.status === 404) {
        setError('Project not found');
      } else {
        setError(err.response?.data?.message || 'Failed to load project details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMemberChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLeaderChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    fetchProject(projectId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'var(--color-success)';
      case 'COMPLETED':
        return 'var(--color-primary)';
      case 'ON_HOLD':
        return 'var(--color-warning)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  // ✅ Get user's role in this project
  const getUserProjectRole = () => {
    if (isAdmin) return 'Admin (System)';
    if (isProjectLeader) return 'Project Leader';
    if (isTeamMember) return 'Team Member';
    return 'Employee (Not a member)';
  };

  // ✅ Get user's role display with icon
  const getRoleDisplayWithIcon = () => {
    if (isAdmin) return { icon: '👑', label: 'Admin (System)', color: 'var(--color-danger)' };
    if (isProjectLeader) return { icon: '👑', label: 'Project Leader', color: 'var(--color-primary)' };
    if (isTeamMember) return { icon: '👤', label: 'Team Member', color: 'var(--color-gray-700)' };
    return { icon: '👤', label: 'Employee (Not a member)', color: 'var(--color-gray-500)' };
  };

  return (
    <PageWrapper
      title={project?.name || 'Project Details'}
      subtitle={project ? `Status: ${project.status}` : 'Loading...'}
      actions={
        <>
          {project && (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/projects/${projectId}/tasks`)}
              disabled={loading}
            >
              📋 View Tasks
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
            onClick={() => navigate('/projects')}
          >
            ← Back to Projects
          </button>
        </>
      }
    >
      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading project details...</p>
        </div>
      )}

      {/* Error */}
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

      {/* Project Details */}
      {!loading && !error && project && (
        <div>
          {/* Project Info */}
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
                  Project Name
                </div>
                <div style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-gray-900)',
                }}>
                  {project.name}
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
                <span style={{
                  display: 'inline-block',
                  backgroundColor: getStatusColor(project.status),
                  color: 'var(--color-white)',
                  padding: 'var(--spacing-1) var(--spacing-3)',
                  borderRadius: 'var(--border-radius-full)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  {project.status}
                </span>
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Project ID
                </div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-700)',
                  wordBreak: 'break-all',
                }}>
                  {project.id}
                </div>
              </div>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-gray-500)',
                      marginBottom: 'var(--spacing-1)',
                    }}>
                      Leader
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-gray-900)',
                    }}>
                      {project.leader?.name || 'Not assigned'}
                    </div>
                  </div>
                  {canChangeLeader && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowChangeLeaderModal(true)}
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        padding: 'var(--spacing-1) var(--spacing-3)',
                        marginLeft: 'var(--spacing-2)',
                      }}
                    >
                      Change Leader
                    </button>
                  )}
                </div>
              </div>

              {/* Your Role in this Project */}
              <div style={{
                gridColumn: '1 / -1',
                paddingTop: 'var(--spacing-3)',
                borderTop: '1px solid var(--border-color)',
                marginTop: 'var(--spacing-2)',
              }}>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-500)',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  Your Role in this Project
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontWeight: 'var(--font-weight-semibold)',
                    fontSize: 'var(--font-size-base)',
                    color: getRoleDisplayWithIcon().color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                  }}>
                    <span>{getRoleDisplayWithIcon().icon}</span>
                    <span>{getRoleDisplayWithIcon().label}</span>
                  </span>
                  {isAdmin && (
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-danger)',
                      backgroundColor: 'var(--color-danger-bg)',
                      padding: 'var(--spacing-1) var(--spacing-2)',
                      borderRadius: 'var(--border-radius-full)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      🔑 Full access (Admin)
                    </span>
                  )}
                  {isProjectLeader && (
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-warning)',
                      backgroundColor: 'var(--color-warning-bg)',
                      padding: 'var(--spacing-1) var(--spacing-2)',
                      borderRadius: 'var(--border-radius-full)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      👑 Project Leader
                    </span>
                  )}
                  {isTeamMember && (
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-gray-500)',
                      backgroundColor: 'var(--color-gray-100)',
                      padding: 'var(--spacing-1) var(--spacing-2)',
                      borderRadius: 'var(--border-radius-full)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      👤 Team Member
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Member List */}
          <div className="card">
            <MemberList
              project={project}
              onMemberChange={handleMemberChange}
            />
          </div>

          {/* Quick Actions Card - View Tasks */}
          <div className="card" style={{
            marginTop: 'var(--spacing-4)',
            backgroundColor: 'var(--color-primary-bg)',
            border: '1px solid var(--color-primary)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--color-primary)' }}>
                  📋 Task Management
                </h4>
                <p style={{
                  margin: 'var(--spacing-1) 0 0 0',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-600)',
                }}>
                  View and manage all tasks for this project
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/projects/${projectId}/tasks`)}
                style={{
                  padding: 'var(--spacing-2) var(--spacing-4)',
                }}
              >
                View Tasks →
              </button>
            </div>
          </div>

          {/* Role-based access info */}
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
                       'var(--color-gray-600)',
              }}>
                {getUserProjectRole()}
              </span>
            </div>
            {isAdmin ? (
              <span>✅ You have Admin access. You can manage members and change leader.</span>
            ) : isProjectLeader ? (
              <span>ℹ️ You are the Project Leader. You can view project details and tasks.</span>
            ) : isTeamMember ? (
              <span>ℹ️ You are a Team Member. You can view project details and tasks.</span>
            ) : (
              <span>ℹ️ You are not a member of this project. Contact the project leader or admin.</span>
            )}
          </div>
        </div>
      )}

      {/* Change Leader Modal */}
      {showChangeLeaderModal && (
        <ChangeLeaderModal
          project={project}
          onClose={() => setShowChangeLeaderModal(false)}
          onSuccess={handleLeaderChange}
        />
      )}
    </PageWrapper>
  );
};

export default ProjectDetailsPage;