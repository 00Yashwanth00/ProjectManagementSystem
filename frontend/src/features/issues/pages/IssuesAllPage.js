// frontend/src/features/issues/pages/IssuesAllPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../components/layout/PageWrapper';
import { getMyProjects } from '../../../api/projectApi/projectApi';
import { getIssuesByProject } from '../../../api/issueApi/issueApi';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import {
  ISSUE_STATUS_LABELS,
  ISSUE_PRIORITY_LABELS,
  ISSUE_PRIORITY_COLORS,
  ISSUE_TYPE_LABELS,
} from '../../../utils/constants/issueConstants';

const IssuesAllPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchAllIssues();
  }, []);

  const fetchAllIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectsResponse = await getMyProjects();
      const projects = projectsResponse.data;
      
      let issues = [];
      for (const project of projects) {
        try {
          const issuesResponse = await getIssuesByProject(project.id);
          const projectIssues = issuesResponse.data.map(issue => ({
            ...issue,
            projectName: project.name,
            projectId: project.id
          }));
          issues = [...issues, ...projectIssues];
        } catch (err) {
          console.error(`Failed to fetch issues for project ${project.id}:`, err);
        }
      }
      
      setAllIssues(issues);
    } catch (err) {
      console.error('Failed to fetch issues:', err);
      setError(err.response?.data?.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueClick = (projectId, issueId) => {
    navigate(`/projects/${projectId}/issues/${issueId}`);
  };

  const getPriorityStyle = (priority) => ({
    color: ISSUE_PRIORITY_COLORS[priority],
    fontWeight: 'var(--font-weight-medium)',
  });

  const getStatusBadge = (status) => ({
    backgroundColor: status === 'OPEN' ? 'var(--color-danger)' :
                    status === 'IN_PROGRESS' ? 'var(--color-warning)' :
                    status === 'RESOLVED' ? 'var(--color-primary)' :
                    'var(--color-success)',
    color: 'var(--color-white)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--border-radius-full)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
  });

  return (
    <PageWrapper
      title="All Issues"
      subtitle={`${allIssues.length} issues across all projects`}
      actions={
        <>
          <button
            className="btn btn-secondary"
            onClick={fetchAllIssues}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </>
      }
    >
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
          <p>Loading issues...</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {allIssues.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <p style={{ color: 'var(--color-gray-500)' }}>No issues found across your projects</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {allIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="card"
                  onClick={() => handleIssueClick(issue.projectId, issue.id)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    padding: 'var(--spacing-3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-2)',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        marginBottom: 'var(--spacing-1)',
                      }}>
                        <span>{ISSUE_TYPE_LABELS[issue.type] || '📋'}</span>
                        <span style={{
                          fontWeight: 'var(--font-weight-semibold)',
                          fontSize: 'var(--font-size-base)',
                          color: 'var(--color-gray-900)',
                        }}>
                          {issue.title}
                        </span>
                      </div>
                      <div style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-gray-500)',
                      }}>
                        📁 {issue.projectName}
                      </div>
                      {issue.assignee && (
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-gray-500)',
                          marginTop: 'var(--spacing-1)',
                        }}>
                          👤 {issue.assignee.name}
                        </div>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-3)',
                      flexWrap: 'wrap',
                    }}>
                      <span style={getPriorityStyle(issue.priority)}>
                        {ISSUE_PRIORITY_LABELS[issue.priority]}
                      </span>
                      <span style={getStatusBadge(issue.status)}>
                        {ISSUE_STATUS_LABELS[issue.status]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default IssuesAllPage;