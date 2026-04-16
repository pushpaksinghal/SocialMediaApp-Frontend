# ConnectSphere Frontend

## Overview

ConnectSphere frontend is built using Angular and communicates with backend microservices via REST APIs.

---

## Tech Stack

* Angular
* TypeScript
* RxJS
* Angular HTTP Client
* Bootstrap / Tailwind (if used)

---

## Features

* User Authentication (Google Login / JWT)
* Create & View Posts
* Like/Unlike Posts
* Responsive UI

---

## Project Structure

```
/src
  /app
    /components
    /services
    /models
```

---

## Prerequisites

* Node.js (v18+ recommended)
* Angular CLI

---

## Installation

### 1. Clone Repository

```
git clone <your-frontend-repo-url>
cd frontend
```

### 2. Install Dependencies

```
npm install
```

---

## Running Locally

```
ng serve
```

App runs at:

```
http://localhost:4200
```

---

## Environment Configuration

Update API URLs in environment file:

```
environment.ts
```

Example:

```
authApiUrl = 'https://auth-service.onrender.com/api'
postApiUrl = 'https://post-service.onrender.com/api'
likeApiUrl = 'https://like-service.onrender.com/api'
```

---

## Build for Production

```
ng build --configuration production
```

---

## Deployment (Render / Static Hosting)

### Option 1: Render (Static Site)

1. Build project:

```
ng build
```

2. Upload `/dist` folder
3. Set publish directory to `dist/<project-name>`

---

### Option 2: Netlify / Vercel (Recommended)

* Drag & drop `dist` folder
* Or connect GitHub repo

---

## API Integration

All API calls are handled via Angular services:

* auth.service.ts
* post.service.ts
* like.service.ts

Ensure correct backend URLs are configured.

---

## Common Issues

### CORS Error

* Fix in backend (enable AllowAnyOrigin)

### 401 Unauthorized

* Check JWT token storage and interceptor

---

## Future Improvements

* State management (NgRx)
* Lazy loading modules
* Better error handling
* UI enhancements

---

## Notes

* Backend services must be deployed before frontend
* Update API URLs after deployment

---
