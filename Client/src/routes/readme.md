# Task Flow

**Task Flow** is a full-stack project management platform inspired by tools like Jira. It allows users to manage workspaces, projects, tasks, comments, task dependencies, and project activity logs through a GraphQL API and a React TypeScript frontend.

The project is designed as an **AI-ready project management system**, with future support for AI-powered task summaries, project Q&A, and RAG-based project insights.

---

## Features

### Authentication

* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Protected frontend routes

### Workspace Management

* Create and manage workspaces
* Workspace ownership
* Workspace member structure prepared for team collaboration

### Project Management

* Create projects inside workspaces
* Project status tracking
* View project details
* Navigate between workspace and project pages

### Task Management

* Create tasks inside projects
* Update task details
* Update task status
* Track priority, assignee, due date, creator, and timestamps

### Comments

* Add comments to tasks
* View task-specific discussion history
* Comment activity is recorded in project activity logs

### Task Dependencies

* Add dependencies between tasks
* Represent blocked/blocking relationships
* Example: `Frontend UI` is blocked by `Backend API`
* Prevents self-dependency at the database level

### Activity Logs

* Automatically records important project actions
* Supports:

  * Workspace created
  * Project created
  * Task created
  * Task status changed
  * Comment added
  * Dependency added
* Uses PostgreSQL `JSONB` payloads for flexible activity metadata

### AI-Ready Architecture

Planned AI features:

* AI-generated task summaries
* AI project assistant
* Project Q&A
* RAG-based retrieval using task descriptions, comments, dependencies, and activity logs
* Future pgvector integration for semantic search

---

## Tech Stack

### Frontend

* React
* TypeScript
* Material UI
* Apollo Client
* React Router
* Vite

### Backend

* Node.js
* TypeScript
* Express.js
* Apollo Server
* GraphQL
* PostgreSQL
* JWT
* bcrypt
* dotenv

### Database

* PostgreSQL
* Relational schema design
* Foreign keys
* Constraints
* Cascading deletes
* JSONB activity log payloads

---

## Project Structure

```txt
Task-Flow/
│
├── backend/
│   ├── src/
│   │   ├── Config/
│   │   ├── Db/
│   │   │   └── Queries/
│   │   ├── Graphql/
│   │   │   ├── Resolvers/
│   │   │   └── TypeDefs/
│   │   ├── Middlewares/
│   │   ├── Services/
│   │   └── index.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── graphql/
│   │   │   ├── mutations/
│   │   │   └── queries/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── context/
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
└── README.md
```

---

## Core Database Entities

The application uses a relational PostgreSQL database with the following main entities:

* `users`
* `workspaces`
* `workspace_members`
* `projects`
* `tasks`
* `comments`
* `task_dependency`
* `activitylogs`

### Activity Log Example

```json
{
  "activity_type": "TASK_STATUS_CHANGED",
  "payload_json": {
    "task_title": "Build dependency feature",
    "old_status": "TODO",
    "new_status": "DONE"
  }
}
```

---

## GraphQL API Overview

### Authentication

```graphql
mutation RegisterUser {
  registerUser(name: "...", email: "...", password: "...") {
    token
    user {
      id
      name
      email
    }
  }
}
```

```graphql
mutation LoginUser {
  loginUser(email: "...", password: "...") {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Workspaces

```graphql
query GetWorkspaces {
  getWorkspaces {
    id
    name
    description
    owner_id
    created_at
    updated_at
  }
}
```

### Projects

```graphql
query GetProjectsByWorkspace($workspace_id: ID!) {
  getProjectsByWorkspace(workspace_id: $workspace_id) {
    id
    name
    description
    status
    workspace_id
  }
}
```

### Tasks

```graphql
query GetTasksByProject($project_id: ID!) {
  Gettasksbyproject(project_id: $project_id) {
    id
    title
    description
    status
    priority
    project_id
    assignee_id
    due_date
  }
}
```

### Comments

```graphql
query GetCommentsByTask($task_id: ID!) {
  Getcommentsbytask(task_id: $task_id) {
    id
    task_id
    author_id
    body
    created_at
    updated_at
  }
}
```

### Dependencies

```graphql
query GetDependenciesByTask($task_id: ID!) {
  GetDependenciesByTask(task_id: $task_id) {
    id
    task_id
    depends_on_task_id
    dependency_type
    task_title
    depends_on_task_title
  }
}
```

### Activity Logs

```graphql
query GetActivityLogsByProject($project_id: ID!) {
  GetActivityLogsByProject(project_id: $project_id) {
    id
    workspace_id
    project_id
    task_id
    actor_id
    actor_name
    activity_type
    payload_json
    created_at
  }
}
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abindas123/Task-Flow.git
cd Task-Flow
```

---

## Backend Setup

### 1. Go to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file inside the backend folder:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

### 4. Start backend server

```bash
npm run dev
```

The backend will run on:

```txt
http://localhost:4000/graphql
```

---

## Frontend Setup

### 1. Go to frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start frontend

```bash
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

---

## Environment Variables

### Backend `.env.example`

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

### Frontend `.env.example`

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

---

## Security Notes

* `.env` files are ignored using `.gitignore`
* Passwords are hashed with bcrypt
* JWT is used for authentication
* Protected routes are used on the frontend
* Sensitive credentials should be stored only as environment variables

---

## Planned Improvements

* AI task summary generation
* AI project assistant
* RAG-based project Q&A
* pgvector semantic search
* Jira-style dashboard UI
* Kanban board view
* Workspace member management UI
* Role-based permissions
* Deployment with Vercel, Render, and Neon PostgreSQL

---

## Why I Built This Project

I built Task Flow to practice and demonstrate real-world full-stack development skills using React, TypeScript, GraphQL, PostgreSQL, and Node.js.

The goal was to build a project that goes beyond simple CRUD by including real project management concepts such as:

* Workspaces
* Projects
* Tasks
* Comments
* Dependencies
* Activity tracking
* Authentication
* AI-ready architecture

This project reflects how modern SaaS tools structure data, track user actions, and prepare for AI-powered productivity features.

---

## Author

**Abin Das**

GitHub: [abindas123](https://github.com/abindas123)

---

## License

This project is open-source and available for learning and portfolio purposes.
