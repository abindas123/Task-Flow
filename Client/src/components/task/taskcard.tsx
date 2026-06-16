import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useNavigate, useParams } from "react-router-dom";

type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  assignee_id: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type TaskCardProps = {
  task: Task;
};

function getStatusColor(status: TaskStatus) {
  if (status === "DONE") return "success";
  if (status === "BLOCKED") return "error";
  if (status === "IN_PROGRESS" || status === "IN_REVIEW") return "warning";
  return "default";
}

function getPriorityColor(priority: TaskPriority) {
  if (priority === "URGENT") return "error";
  if (priority === "HIGH") return "warning";
  if (priority === "MEDIUM") return "info";
  return "default";
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function formatDate(date?: string | null) {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();

  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  function handleViewTask() {
    navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`);
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent>
        <Stack sx={{ gap: 2 }}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: task.status === "BLOCKED" ? "error.main" : "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TaskAltIcon />
            </Box>

            <Chip
              label={formatLabel(task.status)}
              color={getStatusColor(task.status)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {task.title}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.95rem",
                minHeight: 48,
              }}
            >
              {task.description || "No description added for this task."}
            </Typography>
          </Box>

          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              icon={<FlagIcon />}
              label={formatLabel(task.priority)}
              color={getPriorityColor(task.priority)}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          <Divider />

          <Stack sx={{ gap: 1 }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <CalendarMonthIcon
                sx={{
                  fontSize: 18,
                  color: "text.secondary",
                }}
              />

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                Due: {formatDate(task.due_date)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <PersonIcon
                sx={{
                  fontSize: 18,
                  color: "text.secondary",
                }}
              />

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                Assignee: {task.assignee_id ? "Assigned" : "Unassigned"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleViewTask}
        >
          View Task
        </Button>
      </CardActions>
    </Card>
  );
}

export default TaskCard;