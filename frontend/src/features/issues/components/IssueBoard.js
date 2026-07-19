// frontend/src/features/issues/components/IssueBoard.js

import React, { useState } from 'react';
import IssueCard from './IssueCard';
import {
  ISSUE_STATUS,
  ISSUE_STATUS_LABELS,
  ISSUE_STATUS_COLORS,
  ISSUE_STATUS_BG_COLORS,
  isIssueTransitionAllowed,
} from '../../../utils/constants/issueConstants';

const IssueBoard = ({ issues, onStatusChange, onAssign, loading }) => {
  const [draggedIssueId, setDraggedIssueId] = useState(null);

  const groupedIssues = {
    [ISSUE_STATUS.OPEN]: issues.filter(i => i.status === ISSUE_STATUS.OPEN),
    [ISSUE_STATUS.IN_PROGRESS]: issues.filter(i => i.status === ISSUE_STATUS.IN_PROGRESS),
    [ISSUE_STATUS.RESOLVED]: issues.filter(i => i.status === ISSUE_STATUS.RESOLVED),
    [ISSUE_STATUS.CLOSED]: issues.filter(i => i.status === ISSUE_STATUS.CLOSED),
  };

  const handleDragStart = (issueId) => {
    setDraggedIssueId(issueId);
  };

  const handleDragEnd = () => {
    setDraggedIssueId(null);
  };

  const handleDrop = (status) => {
    if (draggedIssueId) {
      const issue = issues.find(i => i.id === draggedIssueId);
      if (issue && issue.status !== status && isIssueTransitionAllowed(issue.status, status)) {
        onStatusChange(draggedIssueId, status);
      }
      setDraggedIssueId(null);
    }
  };

  const renderColumn = (status) => {
    const columnIssues = groupedIssues[status] || [];
    const isDragOver = draggedIssueId && 
      issues.find(i => i.id === draggedIssueId)?.status !== status &&
      isIssueTransitionAllowed(issues.find(i => i.id === draggedIssueId)?.status, status);

    return (
      <div
        style={{
          flex: 1,
          minWidth: '250px',
          backgroundColor: ISSUE_STATUS_BG_COLORS[status],
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-3)',
          border: isDragOver ? '2px dashed var(--color-primary)' : '1px solid var(--border-color)',
          transition: 'all var(--transition-fast)',
          minHeight: '300px',
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(status)}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-3)',
          paddingBottom: 'var(--spacing-2)',
          borderBottom: `2px solid ${ISSUE_STATUS_COLORS[status]}`,
        }}>
          <h4 style={{
            margin: 0,
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-gray-700)',
          }}>
            {ISSUE_STATUS_LABELS[status]}
          </h4>
          <span style={{
            backgroundColor: 'var(--color-gray-200)',
            padding: 'var(--spacing-1) var(--spacing-2)',
            borderRadius: 'var(--border-radius-full)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            {columnIssues.length}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-gray-500)' }}>
            Loading issues...
          </div>
        ) : columnIssues.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-4)',
            color: 'var(--color-gray-400)',
            fontSize: 'var(--font-size-sm)',
            border: '1px dashed var(--color-gray-300)',
            borderRadius: 'var(--border-radius-md)',
          }}>
            No issues
          </div>
        ) : (
          columnIssues.map((issue) => (
            <div
              key={issue.id}
              draggable
              onDragStart={() => handleDragStart(issue.id)}
              onDragEnd={handleDragEnd}
              style={{ cursor: 'grab' }}
            >
              <IssueCard
                issue={issue}
                onStatusChange={onStatusChange}
                onAssign={onAssign}
              />
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--spacing-4)',
      overflowX: 'auto',
      paddingBottom: 'var(--spacing-4)',
    }}>
      {renderColumn(ISSUE_STATUS.OPEN)}
      {renderColumn(ISSUE_STATUS.IN_PROGRESS)}
      {renderColumn(ISSUE_STATUS.RESOLVED)}
      {renderColumn(ISSUE_STATUS.CLOSED)}
    </div>
  );
};

export default IssueBoard;