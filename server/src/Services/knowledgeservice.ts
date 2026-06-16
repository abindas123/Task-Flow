import {
  createEmbedding,
  convertEmbeddingToPgVector,
} from "./embeddingservice.js";

import {
  deleteKnowledgeChunkBySource,
  upsertKnowledgeChunk,
} from "../Db/Queries/knowledge.js"

type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type TaskKnowledgeInput = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  project_id: string;
  assignee_id: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type CommentKnowledgeInput = {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

type DependencyKnowledgeInput = {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: "BLOCKED_BY";
  created_at: string;
};
type ActivityType =
  | "WORKSPACE_CREATED"
  | "PROJECT_CREATED"
  | "TASK_CREATED"
  | "TASK_ASSIGNED"
  | "TASK_STATUS_CHANGED"
  | "COMMENT_ADDED"
  | "DEPENDENCY_ADDED";
  type ActivityPayload = Record<string, unknown> | null;

type ActivityLogKnowledgeInput = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  task_id: string | null;
  actor_id: string;
  actor_name?: string | null;
  activity_type: ActivityType;
  payload_json: ActivityPayload;
  created_at: string;
};
function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function formatNullable(value: string | null | undefined, fallback: string) {
  return value && value.trim() ? value : fallback;
}

function getPayloadValue(payload: ActivityPayload, key: string) {
  const value = payload?.[key];

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);

  return null;
}
async function createAndStoreKnowledgeChunk(input: {
  workspace_id: string;
  project_id?: string | null;
  task_id?: string | null;
  source_type: "TASK" | "COMMENT" | "DEPENDENCY" | "ACTIVITY_LOG";
  source_id: string;
  content: string;
  metadata_json?: Record<string, unknown>;
}) {
  const content = cleanText(input.content);

  if (!content) {
    return;
  }

  try {
    const embedding = await createEmbedding(content);
    const pgVector = convertEmbeddingToPgVector(embedding);

    await upsertKnowledgeChunk({
      workspace_id: input.workspace_id,
      project_id: input.project_id || null,
      task_id: input.task_id || null,
      source_type: input.source_type,
      source_id: input.source_id,
      content,
      embedding: pgVector,
      metadata_json: input.metadata_json || {},
    });
  } catch (error) {
    console.error("Failed to create knowledge chunk:", error);
  }
}

export async function upsertTaskKnowledgeChunk(
  task: TaskKnowledgeInput,
  workspace_id: string
) {
  const content = `
    Task: ${task.title}.
    Description: ${formatNullable(task.description, "No description provided")}.
    Status: ${task.status}.
    Priority: ${task.priority}.
    Assignee ID: ${formatNullable(task.assignee_id, "Unassigned")}.
    Due date: ${formatNullable(task.due_date, "No due date")}.
  `;

  await createAndStoreKnowledgeChunk({
    workspace_id,
    project_id: task.project_id,
    task_id: task.id,
    source_type: "TASK",
    source_id: task.id,
    content,
    metadata_json: {
      source_label: "Task",
      task_title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee_id: task.assignee_id,
      due_date: task.due_date,
      created_by: task.created_by,
    },
  });
}

export async function upsertCommentKnowledgeChunk(
  comment: CommentKnowledgeInput,
  task: TaskKnowledgeInput,
  workspace_id: string
) {
  const content = `
    Comment on task "${task.title}":
    ${comment.body}
  `;

  await createAndStoreKnowledgeChunk({
    workspace_id,
    project_id: task.project_id,
    task_id: comment.task_id,
    source_type: "COMMENT",
    source_id: comment.id,
    content,
    metadata_json: {
      source_label: "Comment",
      task_title: task.title,
      author_id: comment.author_id,
      preview: comment.body.slice(0, 120),
    },
  });
}
export async function deleteCommentKnowledgeChunk(commentId: string) {
  try {
    await deleteKnowledgeChunkBySource("COMMENT", commentId);
  } catch (error) {
    console.error("Failed to delete comment knowledge chunk:", error);
  }
}
export async function upsertDependencyKnowledgeChunk(
  dependency: DependencyKnowledgeInput,
  blockedTask: TaskKnowledgeInput,
  blockingTask: TaskKnowledgeInput,
  workspace_id: string
) {
  const content = `
    Dependency: "${blockedTask.title}" is blocked by "${blockingTask.title}".
    "${blockingTask.title}" must be completed before "${blockedTask.title}" can move forward.
  `;

  await createAndStoreKnowledgeChunk({
    workspace_id,
    project_id: blockedTask.project_id,
    task_id: blockedTask.id,
    source_type: "DEPENDENCY",
    source_id: dependency.id,
    content,
    metadata_json: {
      source_label: "Dependency",
      dependency_type: dependency.dependency_type,
      task_title: blockedTask.title,
      depends_on_task_title: blockingTask.title,
      task_id: blockedTask.id,
      depends_on_task_id: blockingTask.id,
    },
  });
}

export async function deleteDependencyKnowledgeChunk(dependencyId: string) {
  try {
    await deleteKnowledgeChunkBySource("DEPENDENCY", dependencyId);
  } catch (error) {
    console.error("Failed to delete dependency knowledge chunk:", error);
  }
}
function buildActivityContent(activity: ActivityLogKnowledgeInput) {
  const actor = activity.actor_name || `User ${activity.actor_id}`;
  const payload = activity.payload_json || {};

  const taskTitle =
    getPayloadValue(payload, "task_title") ||
    getPayloadValue(payload, "taskTitle") ||
    "Unknown task";

  const projectName =
    getPayloadValue(payload, "project_name") ||
    getPayloadValue(payload, "projectName") ||
    "project";

  const workspaceName =
    getPayloadValue(payload, "workspace_name") ||
    getPayloadValue(payload, "workspaceName") ||
    "workspace";

  const oldStatus =
    getPayloadValue(payload, "old_status") ||
    getPayloadValue(payload, "oldStatus") ||
    "unknown";

  const newStatus =
    getPayloadValue(payload, "new_status") ||
    getPayloadValue(payload, "newStatus") ||
    "unknown";

  const dependsOnTaskTitle =
    getPayloadValue(payload, "depends_on_task_title") ||
    getPayloadValue(payload, "dependsOnTaskTitle") ||
    "another task";

  const preview = getPayloadValue(payload, "preview");

  if (activity.activity_type === "WORKSPACE_CREATED") {
    return `Activity: ${actor} created workspace "${workspaceName}".`;
  }

  if (activity.activity_type === "PROJECT_CREATED") {
    return `Activity: ${actor} created project "${projectName}".`;
  }

  if (activity.activity_type === "TASK_CREATED") {
    return `Activity: ${actor} created task "${taskTitle}".`;
  }

  if (activity.activity_type === "TASK_ASSIGNED") {
    return `Activity: ${actor} assigned task "${taskTitle}".`;
  }

  if (activity.activity_type === "TASK_STATUS_CHANGED") {
    return `Activity: ${actor} changed task "${taskTitle}" from ${oldStatus} to ${newStatus}.`;
  }

  if (activity.activity_type === "COMMENT_ADDED") {
    return `Activity: ${actor} added a comment on task "${taskTitle}"${
      preview ? `: ${preview}` : "."
    }`;
  }

  if (activity.activity_type === "DEPENDENCY_ADDED") {
    return `Activity: ${actor} added dependency: "${taskTitle}" is blocked by "${dependsOnTaskTitle}".`;
  }

  return `Activity: ${actor} performed ${activity.activity_type}.`;
}

export async function upsertActivityLogKnowledgeChunk(
  activity: ActivityLogKnowledgeInput
) {
  const content = buildActivityContent(activity);

  await createAndStoreKnowledgeChunk({
    workspace_id: activity.workspace_id,
    project_id: activity.project_id,
    task_id: activity.task_id,
    source_type: "ACTIVITY_LOG",
    source_id: activity.id,
    content,
    metadata_json: {
      source_label: "Activity Log",
      activity_type: activity.activity_type,
      actor_id: activity.actor_id,
      actor_name: activity.actor_name,
      payload_json: activity.payload_json,
    },
  });
}