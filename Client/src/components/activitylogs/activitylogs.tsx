import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";


import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CommentIcon from "@mui/icons-material/Comment";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import HistoryIcon from "@mui/icons-material/History";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LinkIcon from "@mui/icons-material/Link";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

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

function parsePayload(payload: any) {
  if (!payload) return {};

  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch {
      return {};
    }
  }

  return payload;
}

function formatDate(date: string | null) {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function getActivityColor(
  activityType: string
): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" {
  if (activityType === "WORKSPACE_CREATED") return "primary";
  if (activityType === "PROJECT_CREATED") return "primary";
  if (activityType === "TASK_CREATED") return "success";
  if (activityType === "TASK_STATUS_CHANGED") return "warning";
  if (activityType === "COMMENT_ADDED") return "info";
  if (activityType === "DEPENDENCY_ADDED") return "secondary";

  return "default";
}

function getActivityIcon(activityType: string) {
  if (activityType === "WORKSPACE_CREATED") return <WorkspacesIcon />;
  if (activityType === "PROJECT_CREATED") return <FolderOpenIcon />;
  if (activityType === "TASK_CREATED") return <TaskAltIcon />;
  if (activityType === "TASK_STATUS_CHANGED") return <ChangeCircleIcon />;
  if (activityType === "COMMENT_ADDED") return <CommentIcon />;
  if (activityType === "DEPENDENCY_ADDED") return <LinkIcon />;

  return <InfoOutlinedIcon />;
}

function getPayloadValue(payload: any, camelKey: string, snakeKey: string) {
  return payload?.[camelKey] || payload?.[snakeKey];
}

function formatActivity(log: ActivityLog) {
  const actor = log.actor_name || "Demo User";
  const payload = parsePayload(log.payload_json);

  const taskTitle =
    getPayloadValue(payload, "taskTitle", "task_title") || "Unknown task";

  const workspaceName =
    getPayloadValue(payload, "workspaceName", "workspace_name") ||
    "workspace";

  const projectName =
    getPayloadValue(payload, "projectName", "project_name") || "project";

  const oldStatus =
    getPayloadValue(payload, "oldStatus", "old_status") || "unknown";

  const newStatus =
    getPayloadValue(payload, "newStatus", "new_status") || "unknown";

  const dependsOn =
    getPayloadValue(payload, "dependsOn", "depends_on_task_title") ||
    getPayloadValue(payload, "dependsOnTaskTitle", "depends_on_task_title") ||
    "another task";

  const commentPreview =
    payload.preview || payload.comment || payload.message || "";

  if (log.activity_type === "WORKSPACE_CREATED") {
    return `${actor} created workspace "${workspaceName}"`;
  }

  if (log.activity_type === "PROJECT_CREATED") {
    return `${actor} created project "${projectName}"`;
  }

  if (log.activity_type === "TASK_CREATED") {
    return `${actor} created task "${taskTitle}"`;
  }

  if (log.activity_type === "TASK_STATUS_CHANGED") {
    return `${actor} changed "${taskTitle}" from ${formatLabel(
      oldStatus
    )} to ${formatLabel(newStatus)}`;
  }

  if (log.activity_type === "COMMENT_ADDED") {
    return `${actor} added a comment on "${taskTitle}"${
      commentPreview ? `: ${commentPreview}` : ""
    }`;
  }

  if (log.activity_type === "DEPENDENCY_ADDED") {
    return `${actor} added dependency: "${taskTitle}" is blocked by "${dependsOn}"`;
  }

  return `${actor} performed ${formatLabel(log.activity_type)}`;
}

function ActivityLogList({ logs }: ActivityLogListProps) {
  if (logs.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "background.default",
        }}
      >
        <HistoryIcon
          color="disabled"
          sx={{
            fontSize: 48,
            mb: 2,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          No activity yet
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "text.secondary",
          }}
        >
          Project activity will appear here when tasks, comments, status
          changes, or dependencies are created.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack sx={{ gap: 2 }}>
      {logs.map((log) => (
        <Paper
          key={log.id}
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.default",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getActivityIcon(log.activity_type)}
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.6,
                  }}
                >
                  {formatActivity(log)}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.85rem",
                    mt: 0.5,
                  }}
                >
                  {formatDate(log.created_at)}
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={formatLabel(log.activity_type)}
              size="small"
              color={getActivityColor(log.activity_type)}
              variant="outlined"
              sx={{
                fontWeight: 600,
              }}
            />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export default ActivityLogList;