import { db } from "../../Config/db.js";
import type { ActivityType } from "../../Services/activitylogs.js";

export async function CreateActivityLog(
  workspace_id: string,
  project_id: string | null,
  task_id: string | null,
  actor_id: string,
  activity_type: ActivityType,
  payload_json: Record<string, unknown> | null
) {
  const result = await db.query(
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
    RETURNING *
    `,
    [
      workspace_id,
      project_id,
      task_id,
      actor_id,
      activity_type,
      payload_json,
    ]
  );

  return result.rows[0];
}

export async function GetActivityLogsByProject(project_id: string) {
  const result = await db.query(
    `
    SELECT
      al.id,
      al.workspace_id,
      al.project_id,
      al.task_id,
      al.actor_id,
      u.name AS actor_name,
      al.activity_type,
      al.payload_json,
      al.created_at
    FROM activitylogs al
    JOIN users u
      ON u.id = al.actor_id
    WHERE al.project_id = $1
    ORDER BY al.created_at DESC
    `,
    [project_id]
  );

  return result.rows;
}