import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_COLORS,
} from '../../../utils/constants/taskConstants';

const TaskCard = ({ task, onStatusChange, onAssign }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // ✅ Navigate with project ID and task ID
    navigate(`/projects/${task.projectId}/tasks/${task.id}`);
  };

  const getPriorityStyle = (priority) => ({
    color: TASK_PRIORITY_COLORS[priority],
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
      {/* Title */}
      <div style={{
        fontWeight: 'var(--font-weight-semibold)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-gray-900)',
        marginBottom: 'var(--spacing-1)',
      }}>
        {task.title}
      </div>

      {/* Description preview */}
      {task.description && (
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-gray-500)',
          marginBottom: 'var(--spacing-2)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {task.description}
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
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
          {/* Priority */}
          <span style={getPriorityStyle(task.priority)}>
            {TASK_PRIORITY_LABELS[task.priority]}
          </span>
          
          {/* Assignee */}
          {task.assignee && (
            <span>
              👤 {task.assignee.name}
            </span>
          )}
        </div>
        
        {/* Status badge */}
        <span style={{
          backgroundColor: 'var(--color-gray-100)',
          padding: 'var(--spacing-1) var(--spacing-2)',
          borderRadius: 'var(--border-radius-full)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-gray-600)',
        }}>
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;