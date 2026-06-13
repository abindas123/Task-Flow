# Task Flow

Task Flow is a full-stack project management application inspired by tools like Jira. It allows users to manage workspaces, projects, tasks, comments, task dependencies, and project activity logs through a GraphQL API and a React TypeScript frontend.

The project is built to demonstrate real-world full-stack development skills using React, TypeScript, Node.js, GraphQL, PostgreSQL, and Material UI. It is also designed as an AI-ready productivity platform, with planned support for AI task summaries, project Q&A, and RAG-based project insights.

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Protected frontend routes

### Workspace Management

* Create and manage workspaces
* Workspace ownership
* Workspace member structure prepared for team collaboration

### Project Management

* Create projects inside workspaces
* Track project status
* View project details
* Navigate between workspaces, projects, and tasks

### Task Management

* Create tasks inside projects
* Update task details
* Update task status
* Track priority, assignee, due date, creator, and timestamps

### Comments

* Add comments to tasks
* View task-specific discussion history
* Record comment activity in the project activity log

### Task Dependencies

* Add dependencies between tasks
* Represent blocked/blocking task relationships
* Example: `Frontend UI` is blocked by `Backend API`
* Prevent self-dependency at the database level

### Activity Logs

* Automatically records important project actions
* Tracks workspace creation, project creation, task creation, task status changes, comments, and dependencies
* Uses PostgreSQL `JSONB` payloads for flexible activity metadata

### AI-Ready Architecture

Planned AI features:

* AI-generated task summaries
* AI project assistant
* Project Q&A
* RAG-based retrieval using task descriptions, comments, dependencies, and activity logs
* Future `pgvector` integration for semantic search

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Material UI
* Apollo Client
* React Router

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
├── Client/
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
│   └── .gitignore
│
├── server/
│   ├── src/
│   │   ├── Config/
│   │   ├── Db/
│   │   │   ├── Migrations/
│   │   │   └── Queries/
│   │   ├── Graphql/
│   │   │   ├── Resolvers/
│   │   │   └── TypeDefs/
│   │   ├── Services/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## Core Database Entities

The application uses a relational PostgreSQL database with these main entities:

* `users`
* `workspaces`
* `workspace_members`
* `projects`
* `tasks`
* `comments`
* `task_dependency`
* `activitylogs`

---

## Activity Log Example

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

This allows the project page to show meaningful history such as:

```txt
Abin changed task "Build dependency feature" from TODO to DONE.
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

### 1. Go to the server folder

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file inside the `server` folder:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_here
PORT=5001
```

### 4. Run database migrations

```bash
npm run migrate
```

### 5. Start the backend

```bash
npm run dev
```

The GraphQL API runs at:

```txt
http://localhost:5001/graphql
```

---

## Frontend Setup

### 1. Go to the Client folder

```bash
cd Client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

The frontend runs at:

```txt
http://localhost:5173
```

---

## Environment Variables

### Server

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_here
PORT=5001
```

### Client

If the frontend uses an environment-based GraphQL URL, create a `.env` file inside `Client`:

```env
VITE_GRAPHQL_URL=http://localhost:5001/graphql
```

---

## GraphQL API Overview

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

## Security Notes

* `.env` files are ignored using `.gitignore`
* Passwords are hashed with bcrypt
* JWT is used for authentication
* Frontend routes are protected
* Sensitive credentials are stored only as environment variables

---

## Planned Improvements

* AI task summary generation
* AI project assistant
* RAG-based project Q&A
* `pgvector` semantic search
* Jira-style dashboard UI
* Kanban board view
* Workspace member management UI
* Role-based permissions
* Deployment with Vercel, Render, and Neon PostgreSQL
* CI/CD pipeline with GitHub Actions

---

## Why I Built This Project

I built Task Flow to demonstrate real-world full-stack development skills using React, TypeScript, GraphQL, Node.js, and PostgreSQL.

The project goes beyond basic CRUD by implementing real project management concepts such as workspaces, projects, tasks, comments, dependencies, activity tracking, authentication, and AI-ready architecture.

---

## Author

**Abin Das**

GitHub: [abindas123](https://github.com/abindas123)

---

## License

This project is open-source and available for learning and portfolio purposes.
