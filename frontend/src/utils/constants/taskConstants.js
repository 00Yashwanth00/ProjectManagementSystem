export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.DONE]: 'Done',
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]: 'var(--color-gray-400)',
  [TASK_STATUS.IN_PROGRESS]: 'var(--color-warning)',
  [TASK_STATUS.DONE]: 'var(--color-success)',
};

export const TASK_STATUS_BG_COLORS = {
  [TASK_STATUS.TODO]: 'var(--color-gray-100)',
  [TASK_STATUS.IN_PROGRESS]: 'var(--color-warning-bg)',
  [TASK_STATUS.DONE]: 'var(--color-success-bg)',
};

export const TASK_PRIORITY = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.HIGH]: '🔴 High',
  [TASK_PRIORITY.MEDIUM]: '🟡 Medium',
  [TASK_PRIORITY.LOW]: '🟢 Low',
};

export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITY.HIGH]: 'var(--color-danger)',
  [TASK_PRIORITY.MEDIUM]: 'var(--color-warning)',
  [TASK_PRIORITY.LOW]: 'var(--color-success)',
};

// ✅ Allowed transitions
export const ALLOWED_TASK_TRANSITIONS = {
  [TASK_STATUS.TODO]: [TASK_STATUS.IN_PROGRESS],
  [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.DONE],
  [TASK_STATUS.DONE]: [], // ✅ Cannot transition from DONE
};

export const isTaskTransitionAllowed = (currentStatus, newStatus) => {
  const allowed = ALLOWED_TASK_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
};