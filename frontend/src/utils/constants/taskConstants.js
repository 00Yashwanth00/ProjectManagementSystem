// utils/constants/taskConstants.js

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
    [TASK_STATUS.TODO]: 'var(--color-gray-500)',
    [TASK_STATUS.IN_PROGRESS]: 'var(--color-primary)',
    [TASK_STATUS.DONE]: 'var(--color-success)',
};

export const TASK_STATUS_BG_COLORS = {
    [TASK_STATUS.TODO]: 'var(--color-gray-50)',
    [TASK_STATUS.IN_PROGRESS]: 'var(--color-primary-bg)',
    [TASK_STATUS.DONE]: 'var(--color-success-bg)',
};

export const TASK_PRIORITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
};

export const TASK_PRIORITY_LABELS = {
    [TASK_PRIORITY.LOW]: 'Low',
    [TASK_PRIORITY.MEDIUM]: 'Medium',
    [TASK_PRIORITY.HIGH]: 'High',
};

export const TASK_PRIORITY_COLORS = {
    [TASK_PRIORITY.LOW]: 'var(--color-gray-500)',
    [TASK_PRIORITY.MEDIUM]: 'var(--color-warning)',
    [TASK_PRIORITY.HIGH]: 'var(--color-danger)',
};

// ✅ Allowed transitions
export const TASK_TRANSITIONS = {
    [TASK_STATUS.TODO]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE],
    [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.DONE],
    [TASK_STATUS.DONE]: [],
};

export const isTaskTransitionAllowed = (fromStatus, toStatus) => {
    return TASK_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
};

// ✅ Max tasks per member
export const MAX_TASKS_PER_MEMBER = 3;