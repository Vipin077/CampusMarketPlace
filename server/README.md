# CampusMarketPlace Server

This is the backend service for the CampusMarketPlace application. It provides secure user authentication, task management, and REST APIs built with Java, Spring Boot, Spring Security, JWT, and MongoDB Atlas.

# Completed Features

- User Registration
- User Login
- JWT Authentication
- Spring Security Integration
- MongoDB Atlas Integration
- Create Task
- View All Tasks
- View Task by ID
- Update Own Task
- Delete Own Task
- Owner Authorization
- Global Exception Handling
- Request Validation

## 🛠 Tech Stack

- Java 21
- Spring Boot
- Spring Security
- JWT
- MongoDB Atlas
- Maven
- Lombok

# Security

- JWT-based authentication
- Stateless session management
- Protected APIs
- Only the creator of a task can update or delete it

# REST API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login

# Tasks

- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/{id}
- PUT /api/tasks/{id}
- DELETE /api/tasks/{id}

## ▶ Run the Project

### Prerequisites

- Java 21
- Maven
- MongoDB Atlas connection

### Setup

1. Clone the repository
2. Open the server folder
3. Configure your database and JWT settings in [server/src/main/resources/application.properties](src/main/resources/application.properties)
4. Run the application with Maven:

```bash
./mvnw spring-boot:run
```

### Default Port

The application runs on:

- http://localhost:8080

##  Project Structure

- src/main/java/com/campusmarketplace/server/config
- src/main/java/com/campusmarketplace/server/controller
- src/main/java/com/campusmarketplace/server/dto
- src/main/java/com/campusmarketplace/server/entity
- src/main/java/com/campusmarketplace/server/repository
- src/main/java/com/campusmarketplace/server/service
- src/main/resources/application.properties

##  Notes

Make sure your MongoDB Atlas URI and JWT secret are correctly configured before running the server.
