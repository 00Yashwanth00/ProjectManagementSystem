// ✅ Updated - Only ADMIN and EMPLOYEE
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',  // Unified role for all non-admin users
};

// ✅ Project-specific roles (shown in UI)
export const PROJECT_ROLES = {
  LEADER: 'PROJECT_LEADER',
  MEMBER: 'TEAM_MEMBER',
};

// ✅ For backward compatibility (mapping)
export const USER_ROLE_DISPLAY = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
};

export const PROJECT_ROLE_DISPLAY = {
  [PROJECT_ROLES.LEADER]: 'Project Leader',
  [PROJECT_ROLES.MEMBER]: 'Team Member',
};