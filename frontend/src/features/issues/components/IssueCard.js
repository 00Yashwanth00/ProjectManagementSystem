// frontend/src/features/issues/components/IssueCard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ISSUE_STATUS_LABELS,
  ISSUE_PRIORITY_LABELS,
  ISSUE_PRIORITY_COLORS,
  ISSUE_TYPE_LABELS,
} from '../../../utils/constants/issueConstants';

const IssueCard = ({ issue, onStatusChange, onAssign }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${issue.projectId}/issues/${issue.id}`);
  };

  const getPriorityStyle = (priority) => ({
    color: ISSUE_PRIORITY_COLORS[priority],
    fontWeight: 'var(--font-weight-medium)',
    fontSize: 'var(--font-size-xs)',
  });

  return (
    <div
      className="card"
      style={{
        cursor: 'pointer',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        padding: 'var(--spacing-3)',
        marginBottom: 'var(--spacing-2)',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Type and Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        marginBottom: 'var(--spacing-1)',
      }}>
        <span style={{
          fontSize: 'var(--font-size-base)',
        }}>
          {ISSUE_TYPE_LABELS[issue.type] || '📋'}
        </span>
        <div style={{
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gray-900)',
        }}>
          {issue.title}
        </div>
      </div>

      {/* Description preview */}
      {issue.description && (
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gray-500)',
          marginBottom: 'var(--spacing-2)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {issue.description}
        </div>
      )}

      {/* Meta info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-gray-500)',
        marginTop: 'var(--spacing-2)',
        paddingTop: 'var(--spacing-2)',
        borderTop: 'var(--border-width) solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Priority */}
          <span style={getPriorityStyle(issue.priority)}>
            {ISSUE_PRIORITY_LABELS[issue.priority]}
          </span>
          
          {/* ✅ Assignee - now displays full object */}
          {issue.assignee && (
            <span>
              👤 {issue.assignee.name}
            </span>
          )}
          
          {/* Linked Task */}
          {issue.taskId && (
            <span style={{
              backgroundColor: 'var(--color-gray-100)',
              padding: 'var(--spacing-1) var(--spacing-2)',
              borderRadius: 'var(--border-radius-full)',
              fontSize: 'var(--font-size-xs)',
            }}>
              🔗 Task
            </span>
          )}
        </div>
        
        {/* Status badge */}
        <span style={{
          backgroundColor: issue.status === 'OPEN' ? 'var(--color-danger)' :
                          issue.status === 'IN_PROGRESS' ? 'var(--color-warning)' :
                          issue.status === 'RESOLVED' ? 'var(--color-primary)' :
                          'var(--color-success)',
          color: 'var(--color-white)',
          padding: 'var(--spacing-1) var(--spacing-2)',
          borderRadius: 'var(--border-radius-full)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-medium)',
        }}>
          {ISSUE_STATUS_LABELS[issue.status]}
        </span>
      </div>
    </div>
  );
};

export default IssueCard;