# Project Management System (Backend)

This repository contains the backend implementation of a **Project Management System**, developed as part of an **Object Oriented Design and Analysis (OOAD)** course.

The system follows clean architecture principles, SOLID design principles, and a test-driven approach.

---

## 🛠️ Tech Stack

- **Language**: Java 21
- **Framework**: Spring Boot 3.2.x
- **Database**: MySQL
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security + JWT
- **Testing**: JUnit 5, Mockito, MockMvc
- **Build Tool**: Maven

---

## ✅ Features Implemented So Far

### 1. User Management
- User entity with roles:
  - `ADMIN`
  - `PROJECT_LEADER`
  - `TEAM_MEMBER`
- Email-based user identification
- Repository and service abstraction for user lookup

---

### 2. Project Management
- Project creation:
  - Only **ADMIN** can create a project
  - Admin assigns a **PROJECT_LEADER**
  - Leader is automatically added as a project member
- Project status management (`ACTIVE`, `ON_HOLD`, `COMPLETED`)

---

### 3. Project Membership Management
- Add member to project:
  - Allowed by **ADMIN** or **PROJECT_LEADER**
  - Duplicate members are prevented
- Remove member from project:
  - Allowed by **ADMIN** or **PROJECT_LEADER**
  - Project leader cannot be removed

---

### 4. REST APIs
- Clean RESTful endpoints for project operations
- DTO-based request and response models
- Controllers are thin and delegate logic to services

---

### 5. Exception Handling
- Centralized exception handling using `@RestControllerAdvice`
- Custom exceptions:
  - AccessDeniedException
  - ResourceNotFoundException
  - BusinessException
- Proper HTTP status codes (400, 403, 404, 500)

---

### 6. Authentication & Authorization (JWT)
- JWT-based stateless authentication
- Login endpoint issuing JWT token
- Custom `UserDetailsService`
- JWT filter integrated with Spring Security
- Role-based user model in place

---

### 7. Testing
- Service layer unit tests using Mockito
- Controller layer tests using MockMvc
- Clear separation between business logic tests and HTTP contract tests

---

## 🧩 Design Principles Used

- **Single Responsibility Principle**
- **Separation of Concerns**
- **Layered Architecture**
- **DTO Pattern**
- **Service Layer Pattern**
- **Repository Pattern**

---

## 🚀 Upcoming Features
- Task Management
- Issue / Bug Tracking
- Role-based method security
- Refresh tokens
- Notifications

---

## 📌 How to Run
1. Configure MySQL database
2. Update `application.yml`
3. Run:
   ```bash
   mvn spring-boot:run
