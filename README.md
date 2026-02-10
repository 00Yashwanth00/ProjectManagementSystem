📘 Project Documentation
Project Management System (JIRA Subset)
1. Introduction

The Project Management System (PMS) is a full-stack software application designed to manage projects, tasks, issues (bugs), and team collaboration.
It is inspired by industry tools such as JIRA, but intentionally scoped to demonstrate Object Oriented Design & Analysis (OOAD) concepts.

The system is built using:

Java + Spring Boot (Backend)

MySQL (Database)

JWT-based Authentication

Test-Driven Development (TDD) approach

The project strictly follows:

OOP principles

SOLID principles

Layered architecture

Clean code practices

2. Objectives

The primary objectives of this project are:

To design a real-world OOAD-based system

To apply SOLID principles in practice

To implement secure authentication & authorization

To demonstrate unit testing and controller testing

To build a scalable and extensible backend architecture

3. Technology Stack
Backend

Java 17+

Spring Boot

Spring Security

Spring Data JPA

Hibernate

Database

MySQL

Security

JWT (JSON Web Token)

Role-based authorization

Testing

JUnit 5

Mockito

MockMvc

Tools

Maven

Git & GitHub

Postman (API testing)

4. High-Level Architecture

The application follows a Layered Architecture:

Controller Layer  →  Service Layer  →  Repository Layer  →  Database

Responsibilities:

Controller Layer: HTTP handling, request/response mapping

Service Layer: Business logic & domain rules

Repository Layer: Database interaction

Domain Layer: Core entities & business behavior

5. Authentication & Authorization
Authentication

Implemented using JWT

Users authenticate using email & password

On successful login, a JWT token is generated

Authorization

Role-based access control is enforced using Spring Security.

Roles:

ADMIN

PROJECT_LEADER

TEAM_MEMBER

Authorization rules are enforced at the service layer, not the controller, ensuring proper domain protection.

6. User Management Module
Features Implemented

User registration

User authentication (login)

Role assignment

Fetch user by ID (used internally)

Design Notes

User entity is the core identity of the system

Roles are implemented using enums

Passwords are stored in encrypted form

7. Project Management Module
Features Implemented

Admin can create a project

Admin assigns a project leader

Project has a lifecycle status

Project members can be added/removed

Business Rules

Only ADMIN can create projects

Project leader must have PROJECT_LEADER role

Project leader cannot be removed from their own project

Only Admin or Project Leader can manage members

OOAD Concepts Used

Encapsulation of project rules in ProjectService

Use of enums for ProjectStatus

Clear separation of responsibilities

8. Task Management Module
Features Implemented

Create tasks under a project

Assign tasks to users

Change task status

Task status transitions enforced

Task Status Lifecycle
TODO → IN_PROGRESS → DONE

Business Rules

Only Admin or Project Leader can assign tasks

Team members can update status only if assigned

Invalid state transitions are blocked

Key Design Aspect

Status transition logic is encapsulated inside the Task entity

9. Issue / Bug Tracking Module
Features Implemented

Report an issue or bug

Assign issue to a user

Change issue status

Fetch issues per project

Issue Status Lifecycle
OPEN → IN_PROGRESS → RESOLVED → CLOSED

Business Rules

Any authenticated user can report an issue

Only Admin / Project Leader can assign issues

Team members can update status only if they are assignees

Invalid lifecycle jumps are prevented

OOAD Highlights

Issue lifecycle logic handled within the domain entity

Role checks handled in service layer

10. Comments / Discussion Module
Purpose

The Comments module enables contextual collaboration by allowing users to discuss tasks and issues.

Features Implemented

Add comment to a task

Add comment to an issue

Fetch comments for a task

Fetch comments for an issue

Design Decisions

Comments are dependent entities

A comment belongs to either:

A Task, or

An Issue

Factory methods ensure valid comment creation

Comments are immutable after creation

Benefits

Improves traceability

Provides discussion history

Enhances collaboration

11. Validation & Error Handling
Validation

Implemented using jakarta.validation

Request DTOs validated using annotations like @NotBlank

Global Exception Handling

Centralized exception handling using @ControllerAdvice

Consistent error responses

Common exceptions handled:

Resource not found

Validation errors

Access denied

Internal server errors

12. Testing Strategy

The project follows Test-Driven Development (TDD).

Unit Tests

Service layer tested using JUnit + Mockito

All business rules covered

Edge cases validated

Controller Tests

Implemented using MockMvc

Service layer mocked

Security filters disabled

HTTP contract tested independently

Benefits

High confidence in correctness

Easy refactoring

Industry-standard practice

13. SOLID Principles Applied
Principle	Application
Single Responsibility	Separate layers & services
Open/Closed	New features added without modifying core logic
Liskov Substitution	Role-based polymorphism
Interface Segregation	Clean service interfaces
Dependency Inversion	Services depend on abstractions
14. Extensibility & Future Scope

The system is designed to be easily extensible.

Possible Enhancements

Notifications module

Comment editing & deletion

File attachments

Search & filters

Frontend integration (React)

Audit logging

Pagination & performance optimizations

15. Conclusion

This Project Management System successfully demonstrates:

Real-world OOAD application

Secure backend design

Proper use of Spring Boot

Clean architecture

Professional testing practices
