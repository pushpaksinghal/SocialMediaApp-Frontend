# ConnectSphere Frontend

## Introduction

The ConnectSphere frontend is a modern single-page application built using Angular. It serves as the user interface for interacting with the backend microservices, providing a seamless and responsive experience for users.

The frontend communicates with multiple backend services, integrating authentication, content management, and user interactions into a unified UI.

---

## Architecture Overview

The frontend follows a modular Angular architecture:

* Components handle UI rendering
* Services handle API communication
* Models define data structures
* Interceptors manage authentication tokens

The application is designed to be scalable and maintainable by separating concerns clearly.

---

## Technology Stack

* **Angular** – Frontend framework
* **TypeScript** – Strongly typed JavaScript
* **RxJS** – Reactive programming for async operations
* **Angular HTTP Client** – API communication
* **JWT Handling** – Secure authentication integration

---

## Core Features

### Authentication

* User login via JWT / Google OAuth
* Token storage and management
* Automatic token attachment using HTTP interceptors

---

### Post Management

* Create posts
* View posts
* Fetch data from Post Service

---

### Like System

* Like/unlike posts
* Real-time UI updates based on user interaction

---

## Communication with Backend

The frontend interacts with multiple backend services:

* Auth Service → Handles login and tokens
* Post Service → Manages posts
* Like Service → Manages likes

Each service has its own base URL configured in environment files.

---

## Environment Configuration

API endpoints are defined in Angular environment files.

Example:

```ts
authApiUrl = 'https://auth-service.onrender.com/api';
postApiUrl = 'https://post-service.onrender.com/api';
likeApiUrl = 'https://like-service.onrender.com/api';
```

This allows easy switching between local and production environments.

---

## Authentication Flow

1. User logs in via frontend
2. Auth Service returns JWT token
3. Token is stored (usually in localStorage)
4. HTTP Interceptor attaches token to every request
5. Backend validates token for protected routes

---

## Project Structure

The Angular project is organized into:

* **Components** – UI elements (posts, login, etc.)
* **Services** – API communication logic
* **Models** – Data definitions
* **Interceptors** – Token handling

This structure ensures separation of concerns and scalability.

---

## Running Locally

Install dependencies:

```bash
npm install
```

Run the application:

```bash
ng serve
```

The app will be available at:
http://localhost:4200

---

## Build and Deployment

The application is built using:

```bash
ng build --configuration production
```

The output is generated in the `dist/` folder, which can be deployed to:

* Render (Static Site)
* Netlify
* Vercel

---

## Deployment Strategy

The frontend is deployed as a static site, while backend services run independently.

Key considerations:

* Backend must be deployed first
* API URLs must be updated to production endpoints
* CORS must be enabled in backend

---

## Challenges Addressed

* Managing multiple backend services
* Handling authentication securely
* Ensuring smooth API communication
* Avoiding tight coupling between frontend and backend

---

## Design Principles Followed

* **Modular Design** – Clear separation of features
* **Reusability** – Services and components reused across app
* **Scalability** – Easy to add new features
* **Maintainability** – Clean and readable structure

---

## Future Enhancements

* State management using NgRx
* Improved UI/UX design
* Lazy loading modules
* Error handling and logging improvements

---

## Conclusion

The frontend acts as a bridge between users and a distributed backend system. Built with Angular, it provides a scalable and maintainable structure for interacting with microservices, handling authentication, and delivering a responsive user experience.

---
