📘 Backend API Specification
Project Management System (PMS)

Base URL

http://localhost:8080/api


Authentication

JWT-based

Token must be sent in header:

Authorization: Bearer <JWT_TOKEN>

1️⃣ Authentication APIs
🔐 Login
Endpoint

POST /auth/login


Request Body

{
  "email": "user@test.com",
  "password": "password"
}


Response (200 OK)

{
  "token": "<jwt-token>"
}

🔐 Register User

Endpoint

POST /auth/register


Request Body

{
  "name": "User Name",
  "email": "user@test.com",
  "password": "password",
  "role": "TEAM_MEMBER"
}


Roles

ADMIN | PROJECT_LEADER | TEAM_MEMBER

2️⃣ User APIs
👤 Get User by ID

Endpoint

GET /users/{userId}


Response

{
  "id": "uuid",
  "name": "User Name",
  "email": "user@test.com",
  "role": "TEAM_MEMBER"
}

👥 Get All Users

Endpoint

GET /users

3️⃣ Project Management APIs
📁 Create Project (ADMIN only)

Endpoint

POST /projects


Request Body

{
  "name": "Project Management System",
  "leaderId": "leader-uuid"
}


Response (201 Created)

{
  "id": "project-uuid",
  "name": "Project Management System",
  "status": "ACTIVE"
}

➕ Add Member to Project

Endpoint

POST /projects/{projectId}/members/{userId}


Access

ADMIN

PROJECT_LEADER

➖ Remove Member from Project

Endpoint

DELETE /projects/{projectId}/members/{userId}


Rules

Project leader cannot be removed

Only ADMIN / PROJECT_LEADER allowed

📄 Get Project Details

Endpoint

GET /projects/{projectId}

4️⃣ Task Management APIs
📝 Create Task

Endpoint

POST /projects/{projectId}/tasks


Request Body

{
  "title": "Design database schema",
  "description": "Create ER diagram",
  "priority": "HIGH"
}


Response

{
  "id": "task-uuid",
  "status": "TODO"
}

👤 Assign Task

Endpoint

POST /tasks/{taskId}/assign/{userId}


Access

ADMIN

PROJECT_LEADER

🔄 Change Task Status

Endpoint

PATCH /tasks/{taskId}/status


Request Body

{
  "status": "IN_PROGRESS"
}


Allowed Transitions

TODO → IN_PROGRESS → DONE

📋 Get Tasks by Project

Endpoint

GET /projects/{projectId}/tasks

5️⃣ Issue / Bug Tracking APIs
🐞 Create Issue

Endpoint

POST /projects/{projectId}/issues


Request Body

{
  "title": "Login failure",
  "description": "JWT token invalid",
  "type": "BUG",
  "priority": "HIGH",
  "taskId": "optional-task-uuid"
}

👤 Assign Issue

Endpoint

POST /projects/{projectId}/issues/{issueId}/assign/{userId}


Access

ADMIN

PROJECT_LEADER

🔄 Change Issue Status

Endpoint

PATCH /projects/{projectId}/issues/{issueId}/status


Request Body

{
  "status": "IN_PROGRESS"
}


Lifecycle

OPEN → IN_PROGRESS → RESOLVED → CLOSED

📋 Get Issues by Project

Endpoint

GET /projects/{projectId}/issues

6️⃣ Comments / Discussion APIs
💬 Add Comment to Task

Endpoint

POST /tasks/{taskId}/comments


Request Body

{
  "content": "This task is blocked due to dependency"
}


Response (201)

{
  "id": "comment-uuid",
  "content": "This task is blocked due to dependency",
  "authorId": "user-uuid",
  "createdAt": "2026-02-10T10:30:00"
}

💬 Get Task Comments

Endpoint

GET /tasks/{taskId}/comments

💬 Add Comment to Issue

Endpoint

POST /issues/{issueId}/comments


Request Body

{
  "content": "Bug confirmed, working on fix"
}

💬 Get Issue Comments

Endpoint

GET /issues/{issueId}/comments

7️⃣ Error Response Format (Global)

All errors follow a consistent structure:

{
  "timestamp": "2026-02-10T11:57:38",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed"
}

8️⃣ HTTP Status Codes Used
Code	Meaning
200	OK
201	Created
204	No Content
400	Validation error
403	Access denied
404	Resource not found
500	Internal server error
9️
