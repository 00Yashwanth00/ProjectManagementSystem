import React, { useState } from 'react';
import TaskCard from './TaskCard';
import {
  TASK_STATUS,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  TASK_STATUS_BG_COLORS,
  isTaskTransitionAllowed,
} from '../../../utils/constants/taskConstants';

const TaskBoard = ({ tasks, onStatusChange, onAssign, loading }) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Group tasks by status
  const groupedTasks = {
    [TASK_STATUS.TODO]: tasks.filter(t => t.status === TASK_STATUS.TODO),
    [TASK_STATUS.IN_PROGRESS]: tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS),
    [TASK_STATUS.DONE]: tasks.filter(t => t.status === TASK_STATUS.DONE),
  };

  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDrop = (status) => {
    if (draggedTaskId) {
      const task = tasks.find(t => t.id === draggedTaskId);
      if (task && task.status !== status && isTaskTransitionAllowed(task.status, status)) {
        onStatusChange(draggedTaskId, status);
      }
      setDraggedTaskId(null);
    }
  };

  const renderColumn = (status) => {
    const columnTasks = groupedTasks[status] || [];
    const isDragOver = draggedTaskId && 
      tasks.find(t => t.id === draggedTaskId)?.status !== status &&
      isTaskTransitionAllowed(tasks.find(t => t.id === draggedTaskId)?.status, status);

    return (
      <div
        style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: TASK_STATUS_BG_COLORS[status],
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-3)',
          border: isDragOver ? '2px dashed var(--color-primary)' : '1px solid var(--border-color)',
          transition: 'all var(--transition-fast)',
          minHeight: '300px',
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(status)}
      >
        {/* Column Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-3)',
          paddingBottom: 'var(--spacing-2)',
          borderBottom: `2px solid ${TASK_STATUS_COLORS[status]}`,
        }}>
          <h4 style={{
            margin: 0,
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-gray-700)',
          }}>
            {TASK_STATUS_LABELS[status]}
          </h4>
          <span style={{
            backgroundColor: 'var(--color-gray-200)',
            padding: 'var(--spacing-1) var(--spacing-2)',
            borderRadius: 'var(--border-radius-full)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            {columnTasks.length}
          </span>
        </div>

        {/* Task List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-gray-500)' }}>
            Loading tasks...
          </div>
        ) : columnTasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-4)',
            color: 'var(--color-gray-400)',
            fontSize: 'var(--font-size-sm)',
            border: '1px dashed var(--color-gray-300)',
            borderRadius: 'var(--border-radius-md)',
          }}>
            No tasks
          </div>
        ) : (
          columnTasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => handleDragStart(task.id)}
              onDragEnd={handleDragEnd}
              style={{ cursor: 'grab' }}
            >
              <TaskCard
                task={task}
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
      {renderColumn(TASK_STATUS.TODO)}
      {renderColumn(TASK_STATUS.IN_PROGRESS)}
      {renderColumn(TASK_STATUS.DONE)}
    </div>
  );
};

export default TaskBoard;