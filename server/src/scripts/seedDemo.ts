import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const DEMO_EMAIL = "demo@taskflow.com";
const DEMO_PASSWORD = "Demo@123";

async function getOrCreateDemoUser() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    ON CONFLICT (email)
    DO UPDATE SET
      name = EXCLUDED.name,
      password_hash = EXCLUDED.password_hash
    RETURNING id
    `,
    ["Demo User", DEMO_EMAIL, hashedPassword]
  );

  return result.rows[0].id;
}

async function getOrCreateWorkspace(ownerId: string) {
  const existing = await pool.query(
    `
    SELECT id FROM workspaces
    WHERE owner_id = $1 AND name = $2
    LIMIT 1
    `,
    [ownerId, "Product Team"]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const result = await pool.query(
    `
    INSERT INTO workspaces (name, description, owner_id)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [
      "Product Team",
      "Demo workspace for testing Task Flow features.",
      ownerId,
    ]
  );

  return result.rows[0].id;
}

async function addWorkspaceMember(workspaceId: string, userId: string) {
  await pool.query(
    `
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (workspace_id, user_id)
    DO UPDATE SET role = EXCLUDED.role
    `,
    [workspaceId, userId, "MANAGER"]
  );
}

async function getOrCreateProject(params: {
  name: string;
  description: string;
  workspaceId: string;
  createdBy: string;
}) {
  const existing = await pool.query(
    `
    SELECT id FROM projects
    WHERE workspace_id = $1 AND name = $2
    LIMIT 1
    `,
    [params.workspaceId, params.name]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const result = await pool.query(
    `
    INSERT INTO projects (
      name,
      description,
      workspace_id,
      status,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
    `,
    [
      params.name,
      params.description,
      params.workspaceId,
      "ACTIVE",
      params.createdBy,
    ]
  );

  return result.rows[0].id;
}

async function getOrCreateTask(params: {
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  userId: string;
  dueDate: string;
}) {
  const existing = await pool.query(
    `
    SELECT id FROM tasks
    WHERE project_id = $1 AND title = $2
    LIMIT 1
    `,
    [params.projectId, params.title]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const result = await pool.query(
    `
    INSERT INTO tasks (
      title,
      description,
      status,
      priority,
      project_id,
      assignee_id,
      created_by,
      due_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
    `,
    [
      params.title,
      params.description,
      params.status,
      params.priority,
      params.projectId,
      params.userId,
      params.userId,
      params.dueDate,
    ]
  );

  return result.rows[0].id;
}

async function addComment(params: {
  taskId: string;
  authorId: string;
  body: string;
}) {
  const existing = await pool.query(
    `
    SELECT id FROM comments
    WHERE task_id = $1 AND author_id = $2 AND body = $3
    LIMIT 1
    `,
    [params.taskId, params.authorId, params.body]
  );

  if (existing.rows.length > 0) {
    return;
  }

  await pool.query(
    `
    INSERT INTO comments (task_id, author_id, body)
    VALUES ($1, $2, $3)
    `,
    [params.taskId, params.authorId, params.body]
  );
}

async function addDependency(taskId: string, dependsOnTaskId: string) {
  await pool.query(
    `
    INSERT INTO task_dependency (
      task_id,
      depends_on_task_id,
      dependency_type
    )
    VALUES ($1, $2, $3)
    ON CONFLICT (task_id, depends_on_task_id)
    DO NOTHING
    `,
    [taskId, dependsOnTaskId, "BLOCKED_BY"]
  );
}

async function addActivityLog(params: {
  workspaceId: string;
  projectId: string;
  taskId: string | null;
  actorId: string;
  activityType: string;
  payload: object;
}) {
  await pool.query(
    `
    INSERT INTO activitylogs (
      workspace_id,
      project_id,
      task_id,
      actor_id,
      activity_type,
      payload_json
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      params.workspaceId,
      params.projectId,
      params.taskId,
      params.actorId,
      params.activityType,
      JSON.stringify(params.payload),
    ]
  );
}

async function seedDemo() {
  try {
    console.log("Seeding demo data...");

    const demoUserId = await getOrCreateDemoUser();

    const workspaceId = await getOrCreateWorkspace(demoUserId);

    await addWorkspaceMember(workspaceId, demoUserId);

    const websiteProjectId = await getOrCreateProject({
      name: "Website Redesign",
      description:
        "Improve the landing page, dashboard layout, and task detail experience.",
      workspaceId,
      createdBy: demoUserId,
    });

    const aiProjectId = await getOrCreateProject({
      name: "AI Task Assistant",
      description:
        "Build an AI-powered task summary feature using task details, comments, dependencies, and activity logs.",
      workspaceId,
      createdBy: demoUserId,
    });

    const loginTaskId = await getOrCreateTask({
      title: "Build login page",
      description:
        "Create a clean login page with JWT authentication and demo login support.",
      status: "DONE",
      priority: "HIGH",
      projectId: websiteProjectId,
      userId: demoUserId,
      dueDate: "2026-06-20",
    });

    const dashboardTaskId = await getOrCreateTask({
      title: "Fix dashboard layout",
      description:
        "Improve dashboard cards, spacing, responsive layout, and recent activity section.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      projectId: websiteProjectId,
      userId: demoUserId,
      dueDate: "2026-06-22",
    });

    const dependencyTaskId = await getOrCreateTask({
      title: "Add task dependency feature",
      description:
        "Show which tasks are blocked by other tasks and which tasks are blocking others.",
      status: "DONE",
      priority: "HIGH",
      projectId: websiteProjectId,
      userId: demoUserId,
      dueDate: "2026-06-18",
    });

    const aiPromptTaskId = await getOrCreateTask({
      title: "Write AI summary prompt",
      description:
        "Create a prompt that summarizes task description, comments, dependencies, and activity logs.",
      status: "TODO",
      priority: "URGENT",
      projectId: aiProjectId,
      userId: demoUserId,
      dueDate: "2026-06-25",
    });

    const activityLogTaskId = await getOrCreateTask({
      title: "Add activity log UI",
      description:
        "Display human-readable activity logs instead of raw JSON data.",
      status: "BLOCKED",
      priority: "MEDIUM",
      projectId: aiProjectId,
      userId: demoUserId,
      dueDate: "2026-06-24",
    });

    await addComment({
      taskId: loginTaskId,
      authorId: demoUserId,
      body: "Demo login is working. Need to polish error messages.",
    });

    await addComment({
      taskId: dashboardTaskId,
      authorId: demoUserId,
      body: "Dashboard cards are added. Need to improve spacing and mobile layout.",
    });

    await addComment({
      taskId: aiPromptTaskId,
      authorId: demoUserId,
      body: "AI summary should use task title, description, comments, dependencies, and activity logs.",
    });

    await addDependency(dashboardTaskId, loginTaskId);
    await addDependency(activityLogTaskId, dependencyTaskId);
    await addDependency(aiPromptTaskId, activityLogTaskId);

    await addActivityLog({
      workspaceId,
      projectId: websiteProjectId,
      taskId: loginTaskId,
      actorId: demoUserId,
      activityType: "TASK_CREATED",
      payload: {
        taskTitle: "Build login page",
        message: "Demo User created task Build login page",
      },
    });

    await addActivityLog({
      workspaceId,
      projectId: websiteProjectId,
      taskId: dashboardTaskId,
      actorId: demoUserId,
      activityType: "TASK_STATUS_CHANGED",
      payload: {
        taskTitle: "Fix dashboard layout",
        oldStatus: "TODO",
        newStatus: "IN_PROGRESS",
      },
    });

    await addActivityLog({
      workspaceId,
      projectId: websiteProjectId,
      taskId: dashboardTaskId,
      actorId: demoUserId,
      activityType: "COMMENT_ADDED",
      payload: {
        taskTitle: "Fix dashboard layout",
        comment:
          "Dashboard cards are added. Need to improve spacing and mobile layout.",
      },
    });

    await addActivityLog({
      workspaceId,
      projectId: aiProjectId,
      taskId: aiPromptTaskId,
      actorId: demoUserId,
      activityType: "DEPENDENCY_ADDED",
      payload: {
        taskTitle: "Write AI summary prompt",
        dependsOn: "Add activity log UI",
      },
    });

    console.log("Demo data seeded successfully.");
    console.log("Demo email:", DEMO_EMAIL);
    console.log("Demo password:", DEMO_PASSWORD);
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await pool.end();
  }
}

seedDemo();