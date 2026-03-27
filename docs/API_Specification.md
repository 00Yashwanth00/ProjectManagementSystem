# 📘 Backend API Specification

## Project Management System (PMS)

---

# 🌐 Base URL

```http
http://localhost:8080/api
```

---

# 🔐 Authentication

* JWT-based authentication
* Token must be included in every protected request

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 1️⃣ Authentication APIs

## 🔐 Login

**POST** `/auth/login`

### Request Body

```json
{
  "email": "user@test.com",
  "password": "password"
}
```

### Response (200 OK)

```json
{
  "token": "<jwt-token>"
}
```

---

## 🔐 Register User

**POST** `/auth/register`

### Request Body

```json
{
  "name": "User Name",
  "email": "user@test.com",
  "password": "password",
  "role": "TEAM_MEMBER"
}
```

### Roles

```
ADMIN | PROJECT_LEADER | TEAM_MEMBER
```

---

# 2️⃣ User APIs

## 👤 Get User by ID

**GET** `/users/{userId}`

### Response

```json
{
  "id": "uuid",
  "name": "User Name",
  "email": "user@test.com",
  "role": "TEAM_MEMBER"
}
```

---

## 👥 Get All Users

**GET** `/users`

---

# 3️⃣ Project Management APIs

## 📁 Create Project (ADMIN only)

**POST** `/projects`

### Request Body

```json
{
  "name": "Project Management System",
  "leaderId": "leader-uuid"
}
```

### Response (201 Created)

```json
{
  "id": "project-uuid",
  "name": "Project Management System",
  "status": "ACTIVE"
}
```

---

## ➕ Add Member to Project

**POST** `/projects/{projectId}/members/{userId}`

### Access

* ADMIN
* PROJECT_LEADER

---

## ➖ Remove Member from Project

**DELETE** `/projects/{projectId}/members/{userId}`

### Rules

* Project leader cannot be removed
* Only ADMIN / PROJECT_LEADER allowed

---

## 📄 Get Project Details

**GET** `/projects/{projectId}`

---

# 4️⃣ Task Management APIs

## 📝 Create Task

**POST** `/projects/{projectId}/tasks`

### Request Body

```json
{
  "title": "Design database schema",
  "description": "Create ER diagram",
  "priority": "HIGH"
}
```

### Response

```json
{
  "id": "task-uuid",
  "status": "TODO"
}
```

---

## 👤 Assign Task

**POST** `/tasks/{taskId}/assign/{userId}`

### Access

* ADMIN
* PROJECT_LEADER

---

## 🔄 Change Task Status

**PATCH** `/tasks/{taskId}/status`

### Request Body

```json
{
  "status": "IN_PROGRESS"
}
```

### Allowed Transitions

```
TODO → IN_PROGRESS → DONE
```

---

## 📋 Get Tasks by Project

**GET** `/projects/{projectId}/tasks`

---

# 5️⃣ Issue / Bug Tracking APIs

## 🐞 Create Issue

**POST** `/projects/{projectId}/issues`

### Request Body

```json
{
  "title": "Login failure",
  "description": "JWT token invalid",
  "type": "BUG",
  "priority": "HIGH",
  "taskId": "optional-task-uuid"
}
```

---

## 👤 Assign Issue

**POST** `/projects/{projectId}/issues/{issueId}/assign/{userId}`

### Access

* ADMIN
* PROJECT_LEADER

---

## 🔄 Change Issue Status

**PATCH** `/projects/{projectId}/issues/{issueId}/status`

### Request Body

```json
{
  "status": "IN_PROGRESS"
}
```

### Lifecycle

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

---

## 📋 Get Issues by Project

**GET** `/projects/{projectId}/issues`

---

# 6️⃣ Comments / Discussion APIs

## 💬 Add Comment to Task

**POST** `/tasks/{taskId}/comments`

### Request Body

```json
{
  "content": "This task is blocked due to dependency"
}
```

### Response (201 Created)

```json
{
  "id": "comment-uuid",
  "content": "This task is blocked due to dependency",
  "authorId": "user-uuid",
  "createdAt": "2026-02-10T10:30:00"
}
```

---

## 💬 Get Task Comments

**GET** `/tasks/{taskId}/comments`

---

## 💬 Add Comment to Issue

**POST** `/issues/{issueId}/comments`

### Request Body

```json
{
  "content": "Bug confirmed, working on fix"
}
```

---

## 💬 Get Issue Comments

**GET** `/issues/{issueId}/comments`

---

# 7️⃣ 🔔 Notification APIs (NEW)

## 📩 Get User Notifications

**GET** `/notifications`

### Description

Fetch all notifications for the currently authenticated user.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Response (200 OK)

```json
[
  {
    "id": "notification-uuid",
    "message": "You were assigned task: Design API",
    "type": "TASK_ASSIGNED",
    "read": false,
    "createdAt": "2026-02-10T10:30:00"
  }
]
```

---

## ✅ Mark Notification as Read

**PATCH** `/notifications/{notificationId}/read`

### Description

Marks a notification as read.

### Response

```
204 No Content
```

---

## 🔢 Notification Types

```
TASK_ASSIGNED
ISSUE_ASSIGNED
COMMENT_ADDED
TASK_STATUS_CHANGED
ISSUE_STATUS_CHANGED
PROJECT_MEMBER_ADDED
```

---

# 8️⃣ Error Response Format (Global)

All errors follow a consistent structure:

```json
{
  "timestamp": "2026-02-10T11:57:38",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed"
}
```

---

# 9️⃣ HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Validation Error      |
| 403  | Access Denied         |
| 404  | Resource Not Found    |
| 500  | Internal Server Error |

---

# 🔟 Design Highlights

* RESTful API design
* JWT-secured endpoints
* Role-based authorization
* Consistent request/response structure
* Event-driven notifications
* Clean separation of concerns

---

# ✅ Summary

This API provides:

* Complete project/task/issue lifecycle management
* Collaborative commenting system
* Event-driven notification system
* Secure and scalable backend interface

