import { Paper, Stack, Typography } from "@mui/material";

type ActivityLog = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  task_id: string | null;
  actor_id: string;
  actor_name: string | null;
  activity_type: string;
  payload_json: any;
  created_at: string | null;
};

type ActivityLogListProps = {
  logs: ActivityLog[];
};

function formatDate(date: string | null) {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString();
}

function formatActivity(log: ActivityLog) {
  const actor = log.actor_name || "Someone";
  const payload = log.payload_json || {};

  if (log.activity_type === "WORKSPACE_CREATED") {
    return `${actor} created workspace ${payload.workspace_name || ""}`;
  }

  if (log.activity_type === "PROJECT_CREATED") {
    return `${actor} created project ${payload.project_name || ""}`;
  }

  if (log.activity_type === "TASK_CREATED") {
    return `${actor} created task ${payload.task_title || ""}`;
  }

  if (log.activity_type === "TASK_STATUS_CHANGED") {
    return `${actor} changed task "${payload.task_title || "Unknown task"}" from ${
      payload.old_status || "unknown"
    } to ${payload.new_status || "unknown"}`;
  }

  if (log.activity_type === "COMMENT_ADDED") {
    return `${actor} added a comment on "${
      payload.task_title || "Unknown task"
    }"${payload.preview ? `: ${payload.preview}` : ""}`;
  }

  if (log.activity_type === "DEPENDENCY_ADDED") {
    return `${actor} added dependency: "${
      payload.task_title || "Task"
    }" is blocked by "${
      payload.depends_on_task_title || "another task"
    }"`;
  }

  return `${actor} performed ${log.activity_type}`;
}

function ActivityLogList({ logs }: ActivityLogListProps) {
  if (logs.length === 0) {
    return (
      <Typography color="text.secondary">
        No activity yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {logs.map((log) => (
        <Paper key={log.id} sx={{ p: 2 }}>
          <Stack spacing={0.5}>
            <Typography>{formatActivity(log)}</Typography>

            <Typography variant="caption" color="text.secondary">
              {formatDate(log.created_at)}
            </Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export default ActivityLogList;