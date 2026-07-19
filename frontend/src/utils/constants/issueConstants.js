// frontend/src/utils/constants/issueConstants.js

export const ISSUE_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const ISSUE_STATUS_LABELS = {
  [ISSUE_STATUS.OPEN]: 'Open',
  [ISSUE_STATUS.IN_PROGRESS]: 'In Progress',
  [ISSUE_STATUS.RESOLVED]: 'Resolved',
  [ISSUE_STATUS.CLOSED]: 'Closed',
};

export const ISSUE_STATUS_COLORS = {
  [ISSUE_STATUS.OPEN]: 'var(--color-danger)',
  [ISSUE_STATUS.IN_PROGRESS]: 'var(--color-warning)',
  [ISSUE_STATUS.RESOLVED]: 'var(--color-primary)',
  [ISSUE_STATUS.CLOSED]: 'var(--color-success)',
};

export const ISSUE_STATUS_BG_COLORS = {
  [ISSUE_STATUS.OPEN]: 'var(--color-danger-bg)',
  [ISSUE_STATUS.IN_PROGRESS]: 'var(--color-warning-bg)',
  [ISSUE_STATUS.RESOLVED]: 'var(--color-primary-bg)',
  [ISSUE_STATUS.CLOSED]: 'var(--color-success-bg)',
};

export const ISSUE_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const ISSUE_PRIORITY_LABELS = {
  [ISSUE_PRIORITY.LOW]: 'Low',
  [ISSUE_PRIORITY.MEDIUM]: 'Medium',
  [ISSUE_PRIORITY.HIGH]: 'High',
  [ISSUE_PRIORITY.CRITICAL]: 'Critical',
};

export const ISSUE_PRIORITY_COLORS = {
  [ISSUE_PRIORITY.LOW]: 'var(--color-gray-500)',
  [ISSUE_PRIORITY.MEDIUM]: 'var(--color-warning)',
  [ISSUE_PRIORITY.HIGH]: 'var(--color-danger)',
  [ISSUE_PRIORITY.CRITICAL]: 'var(--color-danger)',
};

export const ISSUE_TYPE = {
  BUG: 'BUG',
  ISSUE: 'ISSUE',
};

export const ISSUE_TYPE_LABELS = {
  [ISSUE_TYPE.BUG]: '🐛 Bug',
  [ISSUE_TYPE.ISSUE]: '📋 Issue',
};

// ✅ Allowed transitions for issues
export const ISSUE_TRANSITIONS = {
  [ISSUE_STATUS.OPEN]: [ISSUE_STATUS.IN_PROGRESS],
  [ISSUE_STATUS.IN_PROGRESS]: [ISSUE_STATUS.RESOLVED],
  [ISSUE_STATUS.RESOLVED]: [ISSUE_STATUS.CLOSED],
  [ISSUE_STATUS.CLOSED]: [],
};

export const isIssueTransitionAllowed = (fromStatus, toStatus) => {
  return ISSUE_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
};