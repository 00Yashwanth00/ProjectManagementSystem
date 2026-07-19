# 📘 Project Management System (PMS)

A full-stack web application for managing projects, tasks, issues, and team collaboration — inspired by tools like JIRA, built to demonstrate strong Object-Oriented Design & Analysis (OOAD) principles and clean backend architecture.

## 📋 Table of Contents

- [Introduction](#introduction)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [Frontend Modules](#frontend-modules)
- [Notification System](#notification-system)
- [Testing](#testing)
- [Deployment Guide](#deployment-guide)
- [API Quick Reference](#api-quick-reference)
- [Sample Data](#sample-data)
- [Extensibility & Future Scope](#extensibility--future-scope)
- [Conclusion](#conclusion)

---

## Introduction

### Project Overview

The Project Management System (PMS) is a full-stack web application designed to manage projects, tasks, issues, and team collaboration.

### Key Features

| Feature | Description |
|---|---|
| User Management | Role-based access with `ADMIN` and `EMPLOYEE` roles |
| Project Management | Create projects, assign leaders, manage members |
| Task Management | Create, assign, and track tasks with status transitions |
| Issue Tracking | Report and track bugs/issues with full lifecycle |
| Comments | Collaborative discussions on tasks and issues |
| Notifications | Real-time event-driven notifications |
| Role-Based Access | Granular permissions based on user roles |

### Objectives

- ✅ Design a real-world OOAD-based backend system
- ✅ Apply SOLID principles in practice
- ✅ Implement secure authentication & authorization
- ✅ Build an extensible and maintainable architecture
- ✅ Demonstrate unit and integration testing

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 17+ | Core language |
| Spring Boot | 3.x | Application framework |
| Spring Security | 3.x | Authentication & Authorization |
| Spring Data JPA | 3.x | ORM & Database access |
| Hibernate | 6.x | JPA Implementation |
| MySQL | 8.x | Relational Database |
| JWT | 0.11.x | Token-based authentication |
| Maven | 3.9.x | Build tool |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI Framework |
| React Router | 6.x | Routing |
| Axios | 1.x | HTTP Client |
| CSS3 | - | Styling with CSS Variables |

### Testing

| Technology | Purpose |
|---|---|
| JUnit 5 | Unit testing |
| Mockito | Mocking framework |
| MockMvc | Controller testing |

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│              PRESENTATION LAYER              │
│         React Frontend (SPA)                 │
│           Components & Pages                 │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              API GATEWAY LAYER               │
│            REST API Endpoints                │
│            Controller Classes                │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│            BUSINESS LOGIC LAYER               │
│              Service Classes                 │
│              Event Publishers                │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│             DATA ACCESS LAYER                 │
│             Repository Classes                │
│               JPA / Hibernate                 │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│               DATABASE LAYER                 │
│                MySQL Database                │
└─────────────────────────────────────────────┘
```

### Module Structure

```
pms-backend/
├── src/main/java/com/yashwanth/pms/
│   ├── auth/              # Authentication & Registration
│   ├── user/              # User Management
│   ├── project/           # Project & Member Management
│   ├── task/              # Task Management
│   ├── issue/              # Issue Tracking
│   ├── comment/           # Comments & Discussions
│   ├── notification/      # Notification System
│   ├── events/            # Event Classes
│   ├── security/          # JWT & Security Config
│   └── common/            # Shared Utilities & Exceptions
│
└── src/test/              # Test Classes
```

### SOLID Principles Applied

| Principle | Application |
|---|---|
| Single Responsibility | Layer separation (Controller, Service, Repository) |
| Open/Closed | Event-based notification system for extension |
| Liskov Substitution | Role-based behavior with proper inheritance |
| Interface Segregation | Clean, focused service interfaces |
| Dependency Inversion | Dependency Injection throughout |

---

## Database Schema

### ER Diagram

```
┌─────────────┐     ┌─────────────┐     ┌───────────────┐
│    users    │     │   projects  │     │project_members│
├─────────────┤     ├─────────────┤     ├───────────────┤
│ id (PK)     │────▶│ id (PK)     │────▶│ project_id    │
│ name        │     │ name        │     │ user_id       │
│ email (UK)  │     │ status      │     │ role          │
│ password    │     │ leader_id   │◀────│               │
│ role        │     │             │     │               │
└─────────────┘     └─────────────┘     └───────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    tasks    │     │   issues    │     │  comments   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ title       │     │ title       │     │ content     │
│ description │     │ description │     │ author_id   │
│ status      │     │ type        │     │ task_id     │
│ priority    │     │ priority    │     │ issue_id    │
│ project_id  │     │ status      │     │ parent_id   │
│ assignee_id │     │ project_id  │     │ created_at  │
│ created_by  │     │ task_id     │     │ updated_at  │
│ created_at  │     │ reporter_id │     │             │
└─────────────┘     │ assignee_id │     └─────────────┘
                     └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │notification │
                     ├─────────────┤
                     │ id (PK)     │
                     │ user_id     │
                     │ message     │
                     │ type        │
                     │ read_flag   │
                     │ created_at  │
                     └─────────────┘
```

### Table Details

#### `users`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BINARY(16) | PRIMARY KEY | User UUID |
| name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address |
| password | VARCHAR(255) | NOT NULL | BCrypt encoded password |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'EMPLOYEE' | ADMIN or EMPLOYEE |

#### `projects`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BINARY(16) | PRIMARY KEY | Project UUID |
| name | VARCHAR(255) | NOT NULL | Project name |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'ACTIVE' | ACTIVE, ON_HOLD, COMPLETED |
| leader_id | BINARY(16) | FOREIGN KEY → users(id) | Project leader |

#### `project_members`

| Column | Type | Constraints | Description |
|---|---|---|---|
| project_id | BINARY(16) | PRIMARY KEY, FOREIGN KEY | Project reference |
| user_id | BINARY(16) | PRIMARY KEY, FOREIGN KEY | User reference |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'TEAM_MEMBER' | PROJECT_LEADER or TEAM_MEMBER |

#### `tasks`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BINARY(16) | PRIMARY KEY | Task UUID |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | VARCHAR(1000) | - | Task description |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'TODO' | TODO, IN_PROGRESS, DONE |
| priority | VARCHAR(50) | NOT NULL, DEFAULT 'MEDIUM' | LOW, MEDIUM, HIGH |
| project_id | BINARY(16) | FOREIGN KEY → projects(id) | Project reference |
| assignee_id | BINARY(16) | FOREIGN KEY → users(id) | Assigned user |
| created_by_id | BINARY(16) | NOT NULL, FOREIGN KEY → users(id) | Creator |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### `issues`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BINARY(16) | PRIMARY KEY | Issue UUID |
| title | VARCHAR(255) | NOT NULL | Issue title |
| description | VARCHAR(1500) | - | Issue description |
| type | VARCHAR(50) | NOT NULL, DEFAULT 'BUG' | BUG, ISSUE |
| priority | VARCHAR(50) | NOT NULL, DEFAULT 'MEDIUM' | LOW, MEDIUM, HIGH, CRITICAL |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'OPEN' | OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| project_id | BINARY(16) | NOT NULL, FOREIGN KEY → projects(id) | Project reference |
| task_id | BINARY(16) | FOREIGN KEY → tasks(id) | Linked task |
| reporter_id | BINARY(16) | NOT NULL, FOREIGN KEY → users(id) | Who reported it |
| assignee_id | BINARY(16) | FOREIGN KEY → users(id) | Assigned user |

#### `comments`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BINARY(16) | PRIMARY KEY | Comment UUID |
| content | VARCHAR(1500) | NOT NULL | Comment content |
| author_id | BINARY(16) | NOT NULL, FOREIGN KEY → users(id) | Author |
| task_id | BINARY(16) | FOREIGN KEY → tasks(id) | Linked task |
| issue_id | BINARY(16) | FOREIGN KEY → issues(id) | Linked issue |
| parent_comment_id | BINARY(16) | FOREIGN KEY → comments(id) | Parent for replies |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | - | Last update timestamp |

#### `notification`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BINARY(16) | PRIMARY KEY | Notification UUID |
| user_id | BINARY(16) | FOREIGN KEY → users(id) | Recipient |
| message | VARCHAR(1000) | - | Notification message |
| type | VARCHAR(50) | - | Notification type |
| read_flag | TINYINT(1) | NOT NULL, DEFAULT 0 | Read status |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

---

## Authentication & Authorization

### Authentication Flow

```
Client (Frontend) → POST /auth/login → JWT Token Generated → Protected Endpoints
       │                                                              │
       ▼                                                              ▼
Login Request → Validate Credentials → Return JWT Token → Include in Header (Bearer)
```

### Roles & Permissions

**System Roles**

| Role | Description |
|---|---|
| ADMIN | Full system access. Can create users, projects, and manage everything |
| EMPLOYEE | Project-level access. Can be Project Leader or Team Member |

**Project Roles**

| Role | Description |
|---|---|
| PROJECT_LEADER | Can create/assign tasks, manage project, assign issues |
| TEAM_MEMBER | Can work on tasks, report issues, comment |

**Permission Matrix**

| Action | ADMIN | PROJECT_LEADER | TEAM_MEMBER |
|---|---|---|---|
| Create User | ✅ | ❌ | ❌ |
| View All Users | ✅ | ❌ | ❌ |
| Create Project | ✅ | ❌ | ❌ |
| Add/Remove Members | ✅ | ❌ | ❌ |
| Change Project Leader | ✅ | ❌ | ❌ |
| Create Task | ✅ | ✅ | ❌ |
| Assign Task | ✅ | ✅ | ❌ |
| Change Task Status | ✅ | ✅ | ✅ (if assignee) |
| Create Issue | ❌ | ✅ | ✅ |
| Assign Issue | ❌ | ✅ | ❌ |
| Change Issue Status | ✅ | ✅ | ✅ (if assignee) |
| Add Comment | ✅ | ✅ | ✅ |
| Edit/Delete Comment | ✅ | ✅ (own) | ✅ (own) |

### JWT Token Structure

```json
{
  "sub": "user@email.com",
  "userId": "uuid",
  "name": "John Doe",
  "email": "user@email.com",
  "role": "EMPLOYEE",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication Headers

```
Authorization: Bearer <JWT_TOKEN>
```

### Common Error Response

```json
{
  "timestamp": "2026-07-19T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed"
}
```

### Authentication APIs

**Login** — `POST /auth/login`

Request:
```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Register (ADMIN only)** — `POST /auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "password123"
}
```

Response (201 Created):
```json
{
  "message": "User created successfully with EMPLOYEE role"
}
```

### User APIs

**Get All Users (ADMIN only)** — `GET /users`
```json
[
  { "id": "uuid", "name": "John Doe", "email": "john@company.com", "role": "EMPLOYEE" }
]
```

**Get Current User** — `GET /users/me`
```json
{ "id": "uuid", "name": "John Doe", "email": "john@company.com", "role": "EMPLOYEE" }
```

**Get User by ID** — `GET /users/{userId}`
```json
{ "id": "uuid", "name": "John Doe", "email": "john@company.com", "role": "EMPLOYEE" }
```

### Project APIs

**Create Project (ADMIN only)** — `POST /projects`

Request:
```json
{ "name": "Project Management System", "leaderId": "leader-uuid" }
```

Response (201 Created):
```json
{
  "id": "project-uuid",
  "name": "Project Management System",
  "status": "ACTIVE",
  "leader": { "id": "leader-uuid", "name": "John Doe", "email": "john@company.com", "role": "EMPLOYEE" },
  "members": [
    {
      "user": { "id": "leader-uuid", "name": "John Doe", "email": "john@company.com", "role": "EMPLOYEE" },
      "projectRole": "PROJECT_LEADER"
    }
  ],
  "memberCount": 1
}
```

- `GET /projects` — Get all projects (ADMIN only)
- `GET /projects/my` — Get current user's projects
- `GET /projects/{projectId}` — Get project details
- `POST /projects/{projectId}/members` — Add members (ADMIN only), body: `["user-id-1", "user-id-2"]`
- `DELETE /projects/{projectId}/members/{userId}` — Remove member (ADMIN only)
- `PATCH /projects/{projectId}/leader` — Change project leader (ADMIN only), body: `{ "leaderId": "new-leader-uuid" }`
- `PATCH /projects/{projectId}/promote/{userId}` — Promote member to leader (ADMIN only)
- `PATCH /projects/{projectId}/demote/{userId}` — Demote leader to member (ADMIN only)

### Task APIs

**Create Task (PROJECT_LEADER only)** — `POST /projects/{projectId}/tasks`

Request:
```json
{
  "title": "Design database schema",
  "description": "Create ER diagram",
  "priority": "HIGH",
  "assigneeId": "assignee-uuid"
}
```

Response (201 Created):
```json
{
  "id": "task-uuid",
  "title": "Design database schema",
  "description": "Create ER diagram",
  "status": "TODO",
  "priority": "HIGH",
  "assignee": { "id": "assignee-uuid", "name": "Jane Smith", "email": "jane@company.com", "role": "EMPLOYEE" },
  "createdBy": { "id": "creator-uuid", "name": "John Doe", "email": "john@company.com", "role": "EMPLOYEE" },
  "createdAt": "2026-07-19T10:30:00",
  "projectId": "project-uuid"
}
```

- `GET /projects/{projectId}/tasks` — Get all tasks in project
- `GET /projects/{projectId}/tasks/{taskId}` — Get task details
- `POST /projects/{projectId}/tasks/{taskId}/assign/{userId}` — Assign task (PROJECT_LEADER only)
- `PATCH /projects/{projectId}/tasks/{taskId}/status` — Change task status, body: `{ "status": "IN_PROGRESS" }`
  - Allowed transitions: `TODO → IN_PROGRESS → DONE`, or `TODO → DONE` (skip)
- `GET /projects/{projectId}/tasks/users/{userId}` — Get tasks assigned to a member

### Issue APIs

**Create Issue (PROJECT_LEADER or TEAM_MEMBER)** — `POST /projects/{projectId}/issues`

Request:
```json
{
  "title": "Login failure",
  "description": "JWT token invalid",
  "type": "BUG",
  "priority": "HIGH",
  "taskId": "optional-task-uuid",
  "assigneeId": "optional-assignee-uuid"
}
```

Response (201 Created):
```json
{
  "id": "issue-uuid",
  "title": "Login failure",
  "description": "JWT token invalid",
  "type": "BUG",
  "priority": "HIGH",
  "status": "OPEN",
  "assignee": null,
  "reporter": { "id": "reporter-uuid", "name": "Jane Smith", "email": "jane@company.com", "role": "EMPLOYEE" },
  "taskId": "optional-task-uuid",
  "projectId": "project-uuid"
}
```

- `GET /projects/{projectId}/issues` — Get all issues in project
- `GET /projects/{projectId}/issues/{issueId}` — Get issue details
- `POST /projects/{projectId}/issues/{issueId}/assign/{userId}` — Assign issue (PROJECT_LEADER only)
- `PATCH /projects/{projectId}/issues/{issueId}/status` — Change issue status, body: `{ "status": "IN_PROGRESS" }`
  - Allowed transitions: `OPEN → IN_PROGRESS → RESOLVED → CLOSED`

### Comment APIs

- `POST /tasks/{taskId}/comments` — Add comment to task, body: `{ "content": "...", "parentCommentId": null }`
- `GET /tasks/{taskId}/comments` — Get task comments
- `POST /issues/{issueId}/comments` — Add comment to issue
- `GET /issues/{issueId}/comments` — Get issue comments
- `PUT /comments/{commentId}` — Edit comment
- `DELETE /comments/{commentId}` — Delete comment
- `POST /comments/{commentId}/replies` — Reply to comment

Example comment response:
```json
{
  "id": "comment-uuid",
  "content": "This task is blocked due to dependency",
  "author": { "id": "author-uuid", "name": "John Doe", "email": "john@company.com", "role": "EMPLOYEE" },
  "createdAt": "2026-07-19T10:30:00",
  "updatedAt": null,
  "edited": false,
  "taskId": "task-uuid",
  "issueId": null,
  "parentCommentId": null,
  "replies": [],
  "canEdit": true,
  "canDelete": true
}
```

### Notification APIs

- `GET /notifications` — Get all notifications
- `GET /notifications/unread/count` — Get unread count, e.g. `{ "unreadCount": 3 }`
- `GET /notifications/{notificationId}` — Get single notification
- `PATCH /notifications/{notificationId}/read` — Mark notification as read
- `PATCH /notifications/read-all` — Mark all notifications as read
- `DELETE /notifications/{notificationId}` — Delete a notification
- `DELETE /notifications` — Delete all notifications

### HTTP Status Codes

| Code | Meaning | Description |
|---|---|---|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content to return |
| 400 | Bad Request | Validation error or malformed request |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (e.g., duplicate email) |
| 500 | Internal Server Error | Server-side error |

---

## Frontend Modules

### Module Structure

```
frontend/src/
├── api/                     # API Service Layer
│   ├── authApi.js           # Authentication APIs
│   ├── userApi.js           # User APIs
│   ├── projectApi.js        # Project APIs
│   ├── taskApi.js           # Task APIs
│   ├── issueApi.js          # Issue APIs
│   ├── commentApi.js        # Comment APIs
│   └── notificationApi.js   # Notification APIs
│
├── components/               # Reusable Components
│   ├── common/               # Buttons, Inputs, Modals
│   ├── layout/                # Navbar, Sidebar, Footer
│   └── feedback/              # Error banners, Empty states
│
├── context/                   # React Context Providers
│   ├── AuthContext/           # Authentication state
│   └── NotificationContext/   # Notification state
│
├── features/                  # Feature Modules
│   ├── auth/                  # Login/Register
│   ├── users/                 # User management
│   ├── projects/              # Project management
│   ├── tasks/                 # Task management
│   ├── issues/                # Issue tracking
│   ├── comments/              # Comments
│   ├── notifications/         # Notifications
│   └── dashboard/             # Dashboard
│
├── routes/                    # Routing
│   ├── AppRoutes.js           # Main routes
│   ├── ProtectedRoute.js      # Auth guard
│   └── RoleBasedRoute.js      # Role guard
│
└── utils/                     # Utilities
    ├── constants/              # Constants
    └── formatters/              # Date formatting
```

### Route Structure

| Route | Component | Access |
|---|---|---|
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | ADMIN only |
| `/` | DashboardPage | Authenticated |
| `/projects` | ProjectListPage | Authenticated |
| `/projects/:projectId` | ProjectDetailsPage | Project member |
| `/projects/:projectId/tasks` | TaskBoardPage | Project member |
| `/projects/:projectId/tasks/:taskId` | TaskDetailsPage | Project member |
| `/projects/:projectId/issues` | IssueBoardPage | Project member |
| `/projects/:projectId/issues/:issueId` | IssueDetailsPage | Project member |
| `/notifications` | NotificationsPage | Authenticated |
| `/users` | AllUsersPage | ADMIN only |
| `/profile` | UserProfilePage | Authenticated |

### Key Components

- **AuthContext.js** — Manages authentication state, login/logout, and token storage.
- **NotificationContext.js** — Manages unread notification count with auto-refresh.
- **ProtectedRoute.js** — Redirects to login if user is not authenticated.
- **RoleBasedRoute.js** — Restricts access based on user role.
- **PageWrapper.js** — Provides consistent page structure with title, subtitle, and actions.

---

## Notification System

### Event-Driven Architecture

```
Service Layer → Event Publisher → Listener → Notification Service → Database
                                                        ▲
                                     Service Layer ─────┘
```

### Notification Types

| Type | Trigger Event | Recipient |
|---|---|---|
| TASK_ASSIGNED | Task assigned to user | Assignee |
| ISSUE_ASSIGNED | Issue assigned to user | Assignee |
| COMMENT_ADDED | Comment added to task/issue | Assignee, Reporter, Project Leader |
| TASK_STATUS_CHANGED | Task status changed | Assignee, Creator |
| ISSUE_STATUS_CHANGED | Issue status changed | Assignee, Reporter |
| PROJECT_MEMBER_ADDED | Member added to project | New member |

### Notification Flow

```java
// 1. Service publishes event
publisher.publishEvent(new TaskAssignedEvent(taskId, assigneeId, taskTitle));

// 2. Listener handles event
@EventListener
public void handleTaskAssigned(TaskAssignedEvent event) {
    String message = "You were assigned task: " + event.getTaskTitle();
    notificationService.notifyUser(event.getAssigneeId(), NotificationType.TASK_ASSIGNED, message);
}

// 3. Notification saved to database
public void notifyUser(UUID userId, NotificationType type, String message) {
    Notification notification = new Notification(userId, message, type);
    repository.save(notification);
}
```

---

## Testing

### Test Coverage

| Module | Test Count | Key Tests |
|---|---|---|
| Authentication | 6 | Login, Register, Token validation |
| User Management | 4 | Get users, Profile |
| Project Management | 15 | Create, Add members, Remove members |
| Task Management | 37 | Create, Assign, Status transitions |
| Issue Management | 70 | Create, Assign, Status transitions |
| Comments | 79 | Add, Edit, Delete, Reply |
| Notifications | 68 | Creation, Mark read, Delete |
| **Total** | **~279** | |

### Sample Test

```java
@Test
void shouldCreateNotification() {
    UUID userId = UUID.randomUUID();
    String message = "Task assigned";
    NotificationType type = NotificationType.TASK_ASSIGNED;

    service.notifyUser(userId, type, message);

    verify(repository, times(1)).save(any(Notification.class));

    ArgumentCaptor<Notification> captor = ArgumentCaptor.forClass(Notification.class);
    verify(repository).save(captor.capture());

    Notification saved = captor.getValue();
    assertEquals(userId, saved.getUserId());
    assertEquals(message, saved.getMessage());
    assertEquals(type, saved.getType());
    assertFalse(saved.isRead());
}
```

### Test Execution

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=NotificationServiceTest

# Run with coverage
mvn test jacoco:report
```

---

## Deployment Guide

### Prerequisites

```
Java 17+
MySQL 8.x
Node.js 16+ (for frontend)
Maven 3.9+
```

### Backend Deployment

```bash
# 1. Clone repository
git clone <repository-url>
cd pms-backend

# 2. Configure application.properties
# Edit src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/project_management
spring.datasource.username=root
spring.datasource.password=yourpassword

# 3. Build the application
mvn clean package

# 4. Run the application
java -jar target/pms-0.0.1-SNAPSHOT.jar

# Or run with Maven
mvn spring-boot:run
```

### Frontend Deployment

```bash
# 1. Navigate to frontend directory
cd pms-frontend

# 2. Install dependencies
npm install

# 3. Configure API base URL
# Create .env file
REACT_APP_API_BASE_URL=http://localhost:8080/api

# 4. Start development server
npm start

# 5. Build for production
npm run build
```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile for Backend
FROM openjdk:17-jdk-slim
COPY target/pms-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```dockerfile
# Dockerfile for Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

---

## API Quick Reference

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | Create user | ADMIN |

### Users

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users` | Get all users | ADMIN |
| GET | `/users/me` | Get current user | Authenticated |
| GET | `/users/{id}` | Get user by ID | ADMIN |

### Projects

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/projects` | Create project | ADMIN |
| GET | `/projects` | Get all projects | ADMIN |
| GET | `/projects/my` | Get user's projects | Authenticated |
| GET | `/projects/{id}` | Get project details | Project member |
| POST | `/projects/{id}/members` | Add members | ADMIN |
| DELETE | `/projects/{id}/members/{uid}` | Remove member | ADMIN |
| PATCH | `/projects/{id}/leader` | Change leader | ADMIN |
| PATCH | `/projects/{id}/promote/{uid}` | Promote to leader | ADMIN |
| PATCH | `/projects/{id}/demote/{uid}` | Demote from leader | ADMIN |

### Tasks

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/projects/{pid}/tasks` | Create task | PROJECT_LEADER |
| GET | `/projects/{pid}/tasks` | Get all tasks | Project member |
| GET | `/projects/{pid}/tasks/{tid}` | Get task details | Project member |
| POST | `/projects/{pid}/tasks/{tid}/assign/{uid}` | Assign task | PROJECT_LEADER |
| PATCH | `/projects/{pid}/tasks/{tid}/status` | Change status | Authorized |

### Issues

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/projects/{pid}/issues` | Create issue | PROJECT_LEADER or TEAM_MEMBER |
| GET | `/projects/{pid}/issues` | Get all issues | Project member |
| GET | `/projects/{pid}/issues/{iid}` | Get issue details | Project member |
| POST | `/projects/{pid}/issues/{iid}/assign/{uid}` | Assign issue | PROJECT_LEADER |
| PATCH | `/projects/{pid}/issues/{iid}/status` | Change status | Authorized |

### Comments

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/tasks/{tid}/comments` | Add task comment | Authenticated |
| GET | `/tasks/{tid}/comments` | Get task comments | Authenticated |
| POST | `/issues/{iid}/comments` | Add issue comment | Authenticated |
| GET | `/issues/{iid}/comments` | Get issue comments | Authenticated |
| PUT | `/comments/{cid}` | Edit comment | Author/ADMIN |
| DELETE | `/comments/{cid}` | Delete comment | Author/ADMIN |
| POST | `/comments/{cid}/replies` | Reply to comment | Authenticated |

### Notifications

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/notifications` | Get all notifications | Authenticated |
| GET | `/notifications/unread/count` | Get unread count | Authenticated |
| GET | `/notifications/{id}` | Get notification | Authenticated |
| PATCH | `/notifications/{id}/read` | Mark as read | Authenticated |
| PATCH | `/notifications/read-all` | Mark all read | Authenticated |
| DELETE | `/notifications/{id}` | Delete notification | Authenticated |
| DELETE | `/notifications` | Delete all | Authenticated |

---

## Sample Data

### Test Credentials

| User | Email | Password | Role |
|---|---|---|---|
| Admin | admin@test.com | 123456 | ADMIN |
| Employee | employee@test.com | employee123 | EMPLOYEE |

### Sample API Requests

**Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'
```

**Create Project**
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","leaderId":"<LEADER_ID>"}'
```

**Create Task**
```bash
curl -X POST http://localhost:8080/api/projects/<PROJECT_ID>/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Test Description","priority":"HIGH"}'
```

---

## Extensibility & Future Scope

### Planned Enhancements

| Feature | Description | Priority |
|---|---|---|
| Real-time Notifications | WebSocket for instant updates | High |
| Email Notifications | Send email for important events | High |
| File Attachments | Upload files to tasks/issues | Medium |
| Search & Filter | Advanced search across modules | Medium |
| Audit Logs | Track all user actions | Medium |
| Mobile App | React Native mobile application | Low |
| Sprint Management | Agile sprint planning | Low |
| Calendar View | Visual timeline of tasks | Low |

### Design Highlights

- ✅ RESTful API design
- ✅ JWT-secured endpoints
- ✅ Role-based authorization
- ✅ Event-driven notifications
- ✅ Clean separation of concerns
- ✅ SOLID principles applied
- ✅ Comprehensive test coverage

---

## Conclusion

The Project Management System (PMS) is a production-ready, full-stack application that demonstrates:

- Real-world backend architecture with Spring Boot
- Event-driven design for notifications
- Secure authentication with JWT
- Clean and scalable codebase following SOLID principles
- Industry-standard testing practices
- Intuitive UI with React

The system provides complete project/task/issue lifecycle management with a collaborative commenting system and event-driven notifications, making it a robust foundation for team collaboration.
