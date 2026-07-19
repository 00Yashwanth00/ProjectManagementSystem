// frontend/src/features/issues/pages/IssueBoardPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import IssueBoard from '../components/IssueBoard';
import CreateIssueForm from '../components/CreateIssueForm';
import {
  getIssuesByProject,
  createIssue,
  updateIssueStatus,
  assignIssue,
  getIssueById,  // ✅ Import this
} from '../../../api/issueApi/issueApi';
import { getProjectById } from '../../../api/projectApi/projectApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { isIssueTransitionAllowed } from '../../../utils/constants/issueConstants';

const IssueBoardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isProjectLeader = project?.leader?.id === user?.id;
  const isTeamMember = project?.members?.some(m => m.user?.id === user?.id);
  const canCreateIssues = !isAdmin && (isProjectLeader || isTeamMember);

  useEffect(() => {
    if (projectId) {
      fetchProjectAndIssues();
    }
  }, [projectId]);

  const fetchProjectAndIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectResponse = await getProjectById(projectId);
      setProject(projectResponse.data);
      
      const issuesResponse = await getIssuesByProject(projectId);
      
      // ✅ Ensure assignee is properly mapped
      const issuesWithProject = issuesResponse.data.map(issue => ({
        ...issue,
        projectId: projectId,
        assignee: issue.assignee || null  // ✅ Keep assignee object
      }));
      setIssues(issuesWithProject);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err.response?.data?.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (formData) => {
    try {
      const response = await createIssue(projectId, formData);
      const newIssue = {
        ...response.data,
        projectId: projectId,
        assignee: response.data.assignee || null
      };
      setIssues(prev => [...prev, newIssue]);
      setShowCreateForm(false);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    if (!isIssueTransitionAllowed(issue.status, newStatus)) {
      setError(`Cannot transition from ${issue.status} to ${newStatus}`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      await updateIssueStatus(projectId, issueId, newStatus);
      setIssues(prev => prev.map(i => 
        i.id === issueId ? { ...i, status: newStatus } : i
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update issue status');
      setTimeout(() => setError(null), 3000);
    }
  };

  // ✅ Handle assignment - refresh issue data
  const handleAssignIssue = async (issueId, userId) => {
    try {
      await assignIssue(projectId, issueId, userId);
      
      // ✅ Fetch the updated issue to get full assignee details
      const response = await getIssueById(projectId, issueId);
      
      setIssues(prev => prev.map(i => 
        i.id === issueId ? { 
          ...response.data, 
          projectId: projectId,
          assignee: response.data.assignee || null
        } : i
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign issue');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRefresh = () => {
    fetchProjectAndIssues();
  };

  const handleBackToProject = () => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <PageWrapper
      title="Issue Board"
      subtitle={project ? `${issues.length} issues in ${project.name}` : 'Loading...'}
      actions={
        <>
          {canCreateIssues && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? '✕ Cancel' : '+ New Issue'}
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
        <CreateIssueForm
          projectId={projectId}
          onSuccess={handleCreateIssue}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <IssueBoard
        issues={issues}
        onStatusChange={handleStatusChange}
        onAssign={handleAssignIssue}
        loading={loading}
      />

      {!loading && issues.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-4)' }}>
            No issues in this project yet.
            {canCreateIssues && ' Click "New Issue" to raise one.'}
          </p>
          {!canCreateIssues && isAdmin && (
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)' }}>
              💡 Admins cannot create issues. Only Project Leaders and Team Members can raise issues.
            </p>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default IssueBoardPage;