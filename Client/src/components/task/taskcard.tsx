import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
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
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">{task.title}</Typography>

          <Typography variant="body2" color="text.secondary">
            {task.description || "No description"}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip label={task.status} size="small" />
            <Chip label={task.priority} size="small" />
          </Stack>

          {task.assignee_id && (
            <Typography variant="body2">
              Assignee: {task.assignee_id}
            </Typography>
          )}

          {task.due_date && (
            <Typography variant="body2">
              Due date: {task.due_date}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions>
        <Button variant="outlined" size="small" onClick={handleViewTask}>
          View Task
        </Button>
      </CardActions>
    </Card>
  );
}

export default TaskCard;