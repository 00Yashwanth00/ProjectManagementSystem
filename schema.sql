-- ============================================================
-- Project Management System — Final Schema
-- ============================================================

DROP DATABASE IF EXISTS project_management;
CREATE DATABASE project_management;
USE project_management;


-- ============================================================
-- DROP TABLES (correct order)

DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;


-- ============================================================
-- USERS

CREATE TABLE users (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);


-- ============================================================
-- PROJECTS

CREATE TABLE projects (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    leader_id BINARY(16) NOT NULL,

    CONSTRAINT fk_project_leader
        FOREIGN KEY (leader_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- PROJECT MEMBERS (Many-to-Many)

CREATE TABLE project_members (
    project_id BINARY(16),
    user_id BINARY(16),

    PRIMARY KEY (project_id, user_id),

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- TASKS

CREATE TABLE tasks (
    id BINARY(16) PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),

    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,

    project_id BINARY(16),
    assignee_id BINARY(16),
    created_by_id BINARY(16) NOT NULL,

    created_at DATETIME,

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

CREATE TABLE issues (

    id BINARY(16) PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    description VARCHAR(1500),

    type VARCHAR(50),
    priority VARCHAR(50),
    status VARCHAR(50),

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

CREATE TABLE comments (

    id BINARY(16) PRIMARY KEY,

    content VARCHAR(1500) NOT NULL,

    author_id BINARY(16) NOT NULL,
    task_id BINARY(16),
    issue_id BINARY(16),

    created_at DATETIME NOT NULL,

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
-- NOTIFICATION
CREATE TABLE notification (

    id BINARY(16) PRIMARY KEY,

    user_id BINARY(16),

    message VARCHAR(1000),

    type VARCHAR(50),

    read_flag TINYINT(1) NOT NULL DEFAULT 0,

    created_at DATETIME
);
