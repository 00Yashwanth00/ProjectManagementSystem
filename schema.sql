-- ============================================================
-- Project Management System — Final Schema
-- ============================================================

CREATE DATABASE project_management;
USE project_management;


-- ============================================================
-- DROP TABLES (correct order)
-- ============================================================

DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE'
);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, name, email, password, role) 
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')), 
    'System Admin', 
    'admin@test.com', 
    '$2a$10$SN3NgXljrpjXyCAvemIfZudVLspFEXeneiWHAcscLdMFRV1C9Rctm', 
    'ADMIN'
);


-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE projects (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    leader_id BINARY(16) NOT NULL,

    CONSTRAINT fk_project_leader
        FOREIGN KEY (leader_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- PROJECT MEMBERS (plain many-to-many — no role column)
-- ------------------------------------------------------------
-- A member's role within a project (PROJECT_LEADER vs TEAM_MEMBER)
-- is NEVER stored. The application derives it at read time by
-- comparing a row here against projects.leader_id. There is
-- deliberately no `role` column and no separate roles table —
-- storing it here would just be a second, driftable source of
-- truth for something that's a pure function of leader_id.
-- ============================================================

CREATE TABLE project_members (
    project_id BINARY(16),
    user_id BINARY(16),
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ============================================================
-- TASKS
-- ============================================================

CREATE TABLE tasks (
    id BINARY(16) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    project_id BINARY(16),
    assignee_id BINARY(16),
    created_by_id BINARY(16) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL,

    FOREIGN KEY (assignee_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    FOREIGN KEY (created_by_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- ISSUES
-- ============================================================

CREATE TABLE issues (
    id BINARY(16) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1500),
    type VARCHAR(50) NOT NULL DEFAULT 'BUG',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    project_id BINARY(16) NOT NULL,
    task_id BINARY(16),
    reporter_id BINARY(16) NOT NULL,
    assignee_id BINARY(16),

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE SET NULL,

    FOREIGN KEY (reporter_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (assignee_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- COMMENTS
-- ============================================================

CREATE TABLE comments (
    id BINARY(16) PRIMARY KEY,
    content VARCHAR(1500) NOT NULL,
    author_id BINARY(16) NOT NULL,
    task_id BINARY(16),
    issue_id BINARY(16),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE
);


-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notification (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16),
    message VARCHAR(1000),
    type VARCHAR(50),
    read_flag TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- TRIGGERS
-- ------------------------------------------------------------
-- ❌ Removed on purpose: the previous after_project_insert /
-- after_project_leader_update triggers existed only to keep a
-- persisted "role" column in sync across project_members and
-- project_member_roles. Since role is no longer stored anywhere,
-- there's nothing left for a trigger to maintain.
--
-- The application (Project entity + JPA) is now solely responsible
-- for inserting/removing rows in project_members; letting a
-- trigger also insert into that table on project creation would
-- risk a duplicate-key conflict with Hibernate's own insert of the
-- leader into the `members` collection.
-- ============================================================


-- ============================================================
-- INDEXES (for performance)
-- ============================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_leader ON projects(leader_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_issues_project ON issues(project_id);
CREATE INDEX idx_issues_assignee ON issues(assignee_id);
CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_comments_issue ON comments(issue_id);
CREATE INDEX idx_notification_user ON notification(user_id);


-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check all tables
SHOW TABLES;

-- Check admin user exists
SELECT * FROM users WHERE role = 'ADMIN';

-- Count users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================

-- Insert a sample employee (password: employee123)
INSERT INTO users (id, name, email, password, role) 
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')), 
    'John Employee', 
    'employee@test.com', 
    '$2a$10$bZs7b9jDCfhGtOGlDyt0IeylRuCtZv41XQt44KOE0hgcIHlalpKOi', 
    'EMPLOYEE'
);

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

SELECT '✅ Database schema created successfully!' as Status;
