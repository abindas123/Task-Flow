import {
  CreateActivityLog,
  GetActivityLogsByProject,
} from "../Db/Queries/activitylogs.js";

export type ActivityType =
  | "WORKSPACE_CREATED"
  | "PROJECT_CREATED"
  | "TASK_CREATED"
  | "TASK_ASSIGNED"
  | "TASK_STATUS_CHANGED"
  | "COMMENT_ADDED"
  | "DEPENDENCY_ADDED";

type ActivityPayload = Record<string, unknown> | null;

type ActivityLog = {
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

export async function CreateActivityLogService(
  workspace_id: string,
  project_id: string | null,
  task_id: string | null,
  actor_id: string,
  activity_type: ActivityType,
  payload_json: ActivityPayload
): Promise<ActivityLog> {
  const activity = await CreateActivityLog(
    workspace_id,
    project_id,
    task_id,
    actor_id,
    activity_type,
    payload_json
  );

  if (!activity) {
    throw new Error("Error creating activity log");
  }

  return activity;
}

export async function GetActivityLogsByProjectService(
  project_id: string
): Promise<ActivityLog[]> {
  const logs = await GetActivityLogsByProject(project_id);
  return logs;
}