-- ============================================================
-- Project Management System — Complete Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS project_management;
USE project_management;

-- ============================================================
-- DROP TABLES (correct order - child tables first)
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

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE projects (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    leader_id BINARY(16) NULL,

    CONSTRAINT fk_project_leader
        FOREIGN KEY (leader_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================
-- PROJECT MEMBERS — WITH ROLE FIELD
-- ============================================================

CREATE TABLE project_members (
    project_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'TEAM_MEMBER',
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ✅ Index for faster role queries
CREATE INDEX idx_project_members_role ON project_members(role);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);

-- ============================================================
-- TRIGGERS TO ENFORCE ONLY ONE PROJECT_LEADER PER PROJECT
-- ============================================================

-- ✅ Drop existing triggers if they exist
DROP TRIGGER IF EXISTS before_insert_project_members;
DROP TRIGGER IF EXISTS before_update_project_members;

-- ✅ Trigger for INSERT
DELIMITER //

CREATE TRIGGER before_insert_project_members
BEFORE INSERT ON project_members
FOR EACH ROW
BEGIN
    IF NEW.role = 'PROJECT_LEADER' THEN
        IF EXISTS (
            SELECT 1 FROM project_members 
            WHERE project_id = NEW.project_id 
            AND role = 'PROJECT_LEADER'
        ) THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Project already has a leader. Only one PROJECT_LEADER allowed per project.';
        END IF;
    END IF;
END//

DELIMITER ;

-- ✅ Trigger for UPDATE
DELIMITER //

CREATE TRIGGER before_update_project_members
BEFORE UPDATE ON project_members
FOR EACH ROW
BEGIN
    IF NEW.role = 'PROJECT_LEADER' THEN
        IF EXISTS (
            SELECT 1 FROM project_members 
            WHERE project_id = NEW.project_id 
            AND role = 'PROJECT_LEADER'
            AND user_id != NEW.user_id
        ) THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Project already has a leader. Only one PROJECT_LEADER allowed per project.';
        END IF;
    END IF;
END//

DELIMITER ;

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

-- ✅ Task indexes
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);

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

-- ✅ Issue indexes
CREATE INDEX idx_issues_project ON issues(project_id);
CREATE INDEX idx_issues_assignee ON issues(assignee_id);
CREATE INDEX idx_issues_status ON issues(status);

-- ============================================================
-- COMMENTS TABLE
-- ============================================================

CREATE TABLE comments (
    id BINARY(16) PRIMARY KEY,
    content VARCHAR(1500) NOT NULL,
    author_id BINARY(16) NOT NULL,
    task_id BINARY(16),
    issue_id BINARY(16),
    parent_comment_id BINARY(16),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,

    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,

    -- ✅ Ensure comment is linked to either a task OR an issue, not both
    CONSTRAINT chk_comment_target CHECK (
        (task_id IS NOT NULL AND issue_id IS NULL) OR
        (task_id IS NULL AND issue_id IS NOT NULL)
    )
);

-- ✅ Comment indexes
CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_comments_issue ON comments(issue_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_created ON comments(created_at);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);

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

-- ✅ Notification indexes
CREATE INDEX idx_notification_user ON notification(user_id);
CREATE INDEX idx_notification_read ON notification(read_flag);
CREATE INDEX idx_notification_created ON notification(created_at);

-- ============================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_leader ON projects(leader_id);

-- ============================================================
-- INSERT ADMIN USER
-- ============================================================

INSERT INTO users (id, name, email, password, role) 
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')), 
    'testAdmin', 
    'admin@test.com', 
    '$2a$10$SN3NgXljrpjXyCAvemIfZudVLspFEXeneiWHAcscLdMFRV1C9Rctm',  -- Password: 123456
    'ADMIN'
);



-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

SHOW TABLES;
SELECT * FROM users;
SELECT role, COUNT(*) as count FROM users GROUP BY role;

SELECT '✅ Database schema created successfully!' as Status;