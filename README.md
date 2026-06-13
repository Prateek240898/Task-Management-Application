# Task Manager Application

## Overview

Task Manager is a full-stack role-based task management application built using the **MEAN Stack (MongoDB, Express.js, Angular, Node.js)**.

The application allows organizations to manage hierarchical teams and tasks through a structured role-based workflow.

The system supports:

* User Authentication using JWT
* Role-Based Authorization
* Manager, Team Lead, and Employee hierarchy
* Task Assignment and Reassignment
* Dashboard Analytics
* Task Status Tracking
* Responsive Angular Material UI
* Pagination, Sorting, Searching, and Filtering

---

# Features

## Authentication

* User Registration
* User Login
* User Logout
* JWT Authentication
* Secure HTTP-Only Cookies
* Route Protection
* Role-Based Authorization

---

## Dashboard

### Admin Dashboard

* Total Managers
* Total Team Leads
* Total Employees
* Total Tasks
* Pending Tasks
* Completed Tasks

### Manager Dashboard

* Total Team Leads
* Total Employees
* Total Tasks
* Pending Tasks
* Completed Tasks

### Team Lead Dashboard

* Total Employees
* Total Tasks
* Pending Tasks
* Completed Tasks

### Employee Dashboard

* Total Tasks
* Pending Tasks
* Completed Tasks

---

## User Management

### Admin

* Create Manager
* Update Manager
* Delete Manager
* View Managers
* Search Managers
* Sort Managers
* Paginated Manager List

### Manager

* Create Team Lead
* Update Team Lead
* Delete Team Lead
* View Team Leads
* Search Team Leads
* Sort Team Leads
* Paginated Team Lead List

### Team Lead

* View Employees
* Assign Employee to Team
* Unassign Employee from Team
* Search Employees
* Sort Employees
* Paginated Employee List

---

## Task Management

### Manager

* Create Task
* Update Task
* Delete Task
* Assign Task to Self
* Assign Task to Team Leads
* Assign Task to Employees
* Reassign Tasks
* View Own Tasks
* View Team Lead Tasks
* View Employee Tasks

### Team Lead

* Create Task
* Update Task
* Delete Task
* Assign Task to Self
* Assign Task to Team Members
* Reassign Tasks
* View Own Tasks
* View Team Member Tasks

### Employee

* Create Task
* Update Own Tasks
* Delete Own Tasks
* Change Task Status
* View Own Tasks Only

---

## Task Features

* Create Task
* Edit Task
* Delete Task
* View Task Details
* Change Task Status
* Task Assignment
* Task Reassignment
* Search Tasks
* Sort Tasks
* Pagination
* Status Filter

---

## UI Features

* Angular Material Design
* Responsive Layout
* Collapsible Sidebar
* Header Navigation
* Footer
* Confirmation Dialogs
* Toaster Notifications
* Loading Indicators
* Mobile Friendly Design

---

# Tech Stack

## Frontend

* Angular 19
* Angular Material
* RxJS
* TypeScript

## Backend

* Node.js
* Express.js

## Database

* MongoDB

---

# Project Structure

## Backend

```text
Backend/
├── src/
│   ├── common/
│   ├── configs/
│   ├── modules/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── manager/
│   │   ├── task/
│   │   ├── teamLead/
│   │   └── users/
│   └── app.js
├── .env
├── index.js
└── package.json
```

## Frontend

```text
Frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   ├── layout/
│   │   └── shared/
│   ├── environments/
│   └── main.ts
├── angular.json
└── package.json
```

---

# Prerequisites

Install the following software before running the project:

## Backend

* Node.js v22.x
* MongoDB v8.x or later

## Frontend

* Angular CLI v19.x

Verify versions:

```bash
node -v
npm -v
ng version
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Prateek240898/Task-Management-Application.git
```

---

# Backend Setup

Navigate to backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create .env file:

```env
PORT = 3000
MONGO_URI = mongodb://localhost:27017/task-manager
NODE_ENV = development
JWT_SECRET = your_jwt_secret_key
JWT_EXPIRES_IN = 3d
COOKIE_EXPIRES_IN = 3
CLIENT_URL = http://localhost:4200
```

Start backend:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:3000
```

---

# Frontend Setup

Navigate to frontend folder:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Run Angular application:

```bash
ng serve
```

Frontend will run on:

```text
http://localhost:4200
```

---

# Available Commands

## Backend

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

---

## Frontend

Run development server:

```bash
ng serve
```

Build production:

```bash
ng build
```

Run tests:

```bash
ng test
```

---

# Application Roles

## Admin

* Manage Managers
* View Dashboard Analytics

## Manager

* Manage Team Leads
* Manage Tasks
* Assign Tasks

## Team Lead

* Manage Team Members
* Assign Tasks

## Employee

* Manage Own Tasks
* Update Task Status

---

# Live URL

```text
https://task-management-application-ztpt.onrender.com
```

---

# Author

**Prateek Agrawal**
([LinkedIn](https://www.linkedin.com/in/prateekagrawal2498/), [GitHub](https://github.com/Prateek240898))
