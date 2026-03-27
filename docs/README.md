# 📘 Project Documentation

## Project Management System (JIRA Subset)

---

# 1. Introduction

The **Project Management System (PMS)** is a backend application designed to manage projects, tasks, issues (bugs), and team collaboration.

It is inspired by industry tools like **JIRA**, but intentionally scoped to demonstrate strong **Object-Oriented Design & Analysis (OOAD)** principles and clean backend architecture.

The system emphasizes:

* Clean architecture
* SOLID principles
* Scalable design
* Real-world backend patterns

---

# 2. Objectives

The primary objectives of this project are:

* Design a real-world OOAD-based backend system
* Apply SOLID principles in practice
* Implement secure authentication & authorization
* Demonstrate unit and controller testing (TDD)
* Build an extensible and maintainable architecture

---

# 3. Technology Stack

### Backend

* Java 17+
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate

### Database

* MySQL

### Security

* JWT (JSON Web Token)
* Role-based authorization

### Testing

* JUnit 5
* Mockito
* MockMvc

### Tools

* Maven
* Git & GitHub
* Postman

---

# 4. High-Level Architecture

The system follows a **Layered Architecture**:

```
Controller → Service → Repository → Database
```

### Responsibilities

| Layer      | Responsibility                  |
| ---------- | ------------------------------- |
| Controller | HTTP handling, request/response |
| Service    | Business logic & rules          |
| Repository | Database interaction            |
| Domain     | Core entities & behavior        |

---

# 5. Authentication & Authorization

### Authentication

* Implemented using JWT
* Users login with email & password
* Token generated on successful authentication

### Authorization

* Role-based access control
* Enforced at **service layer**

### Roles

* ADMIN
* PROJECT_LEADER
* TEAM_MEMBER

---

# 6. User Management Module

### Features

* User registration
* Login authentication
* Role assignment
* Fetch user details

### Design Notes

* User is the core identity
* Passwords are encrypted
* Roles implemented via enums

---

# 7. Project Management Module

### Features

* Create project (ADMIN)
* Assign project leader
* Add/remove members
* Track project lifecycle

### Business Rules

* Only ADMIN can create projects
* Leader must have PROJECT_LEADER role
* Leader cannot be removed
* Only ADMIN/LEADER manage members

---

# 8. Task Management Module

### Features

* Create tasks under project
* Assign tasks
* Change task status

### Lifecycle

```
TODO → IN_PROGRESS → DONE
```

### Business Rules

* Only ADMIN / LEADER can assign
* Only assignee can update status
* Invalid transitions blocked

---

# 9. Issue / Bug Tracking Module

### Features

* Create issues
* Assign issues
* Update issue status
* Fetch issues per project

### Lifecycle

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

### Business Rules

* Any authenticated user can report issue
* Only ADMIN / LEADER assign issues
* Only assignee updates status

---

# 10. Comments / Discussion Module

### Purpose

Enable collaboration via contextual discussions.

### Features

* Add comment to task
* Add comment to issue
* Fetch comments

### Design Decisions

* Comment belongs to either Task or Issue
* Immutable after creation
* Factory methods ensure valid creation

---

# 11. 🔔 Notification Module 

## Overview

The Notification module provides **real-time system feedback** to users when important actions occur.

It is implemented using an **Event-Driven Architecture** to ensure:

* Loose coupling
* High extensibility
* Clean separation of concerns

---

## Supported Notification Types

```java
TASK_ASSIGNED
ISSUE_ASSIGNED
COMMENT_ADDED
TASK_STATUS_CHANGED
ISSUE_STATUS_CHANGED
PROJECT_MEMBER_ADDED
```

---

## Design Approach

The system uses **Spring Application Events**:

```
Service → Event → Listener → NotificationService → DB
```

### Key Components

| Component           | Responsibility        |
| ------------------- | --------------------- |
| Event               | Carries data          |
| Publisher           | Emits event           |
| Listener            | Handles event         |
| NotificationService | Persists notification |

---

## Event Flow Example

### Task Assignment

```
TaskService.assignTask()
    ↓
publish TaskAssignedEvent
    ↓
NotificationListener
    ↓
NotificationService.notifyUser()
    ↓
Database
```

---

## Event Classes

Examples:

* TaskAssignedEvent
* IssueAssignedEvent
* CommentAddedEvent
* ProjectMemberAddedEvent

### Design Rule

Events contain only:

* IDs
* Strings
* primitive data

❌ No entities
✔ Lightweight DTOs

---

## Notification Entity

```java
Notification {
    UUID id;
    UUID userId;
    String message;
    NotificationType type;
    boolean read;
    LocalDateTime createdAt;
}
```

---

## Notification Strategy

| Event                | Receiver            |
| -------------------- | ------------------- |
| Task Assigned        | Assignee            |
| Issue Assigned       | Assignee            |
| Comment Added        | Assignee / Reporter |
| Task Status Changed  | Assignee            |
| Issue Status Changed | Assignee + Reporter |
| Member Added         | New Member          |

---

## API Endpoints

```
GET /notifications
PATCH /notifications/{id}/read
```

---

## Key Design Decisions

* One notification per user (simple & scalable)
* Event-driven decoupling
* Service layer triggers events
* Listener handles side effects

---

## Benefits

* Loose coupling between modules
* Easy to extend (Email, WebSocket, etc.)
* Follows Open/Closed principle
* Industry-level design pattern

---

# 12. Validation & Error Handling

### Validation

* Implemented using `jakarta.validation`

### Exception Handling

* Global handling using `@ControllerAdvice`
* Standard error response format

---

# 13. Testing Strategy

### Approach

* Test-Driven Development (TDD)

### Unit Tests

* Service layer tested with Mockito

### Controller Tests

* MockMvc used
* Security disabled
* HTTP contract verified

### Event Testing

* Listener tested using Mockito
* Event publishing verified in service tests

---

# 14. SOLID Principles Applied

| Principle | Application              |
| --------- | ------------------------ |
| SRP       | Layer separation         |
| OCP       | Event-based extension    |
| LSP       | Role-based behavior      |
| ISP       | Clean service interfaces |
| DIP       | Dependency injection     |

---

# 15. Extensibility & Future Scope

* Real-time notifications (WebSocket)
* Email notifications
* Notification preferences
* File attachments
* Search & filtering
* Frontend integration (React)
* Audit logging

---

# 16. Conclusion

This system demonstrates:

* Real-world backend architecture
* Event-driven design
* Secure authentication
* Clean and scalable codebase
* Industry-standard testing practices

The addition of the **Notification Module using Event Pattern** elevates the system to a production-grade design level.

