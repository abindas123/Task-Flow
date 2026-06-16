import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AddTaskIcon from "@mui/icons-material/AddTask";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useQuery } from "@apollo/client/react";

import TaskForm from "./taskform";
import TaskCard from "./taskcard";
import type { Task } from "./taskcard";
import { GET_TASKS_BY_PROJECT } from "../../graphql/queries/taskQueries";

type GetTasksByProjectResponse = {
  Gettasksbyproject: Task[];
};

type GetTasksByProjectVariables = {
  project_id: string;
};

type TaskListProps = {
  project_id: string;
  workspace_id: string;
};

function TaskList({ project_id, workspace_id }: TaskListProps) {
  const { data, loading, error, refetch } = useQuery<
    GetTasksByProjectResponse,
    GetTasksByProjectVariables
  >(GET_TASKS_BY_PROJECT, {
    variables: {
      project_id,
    },
    skip: !project_id,
  });

  if (!project_id) {
    return <Alert severity="error">Project ID is missing.</Alert>;
  }

  if (loading) {
    return (
      <Stack sx={{ alignItems: "center", gap: 2, py: 4 }}>
        <CircularProgress />
        <Typography sx={{ color: "text.secondary" }}>
          Loading tasks...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Something went wrong while loading tasks. {error.message}
      </Alert>
    );
  }

  const tasks = data?.Gettasksbyproject ?? [];

  return (
    <Stack sx={{ gap: 4 }}>
      {/* Create Task Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "background.default",
        }}
      >
        <Stack sx={{ gap: 2 }}>
          <Box>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <AddTaskIcon color="primary" />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Create a new task
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 0.5,
                color: "text.secondary",
              }}
            >
              Add work items, assign priority, set status, and track progress.
            </Typography>
          </Box>

          <TaskForm
            project_id={project_id}
            workspace_id={workspace_id}
            onCreated={() => void refetch()}
          />
        </Stack>
      </Paper>

      {/* Task List Header */}
      <Box>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <TaskAltIcon color="primary" />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Project Tasks
          </Typography>
        </Stack>

        <Typography
          sx={{
            mt: 0.5,
            color: "text.secondary",
          }}
        >
          {tasks.length} task{tasks.length === 1 ? "" : "s"} available
        </Typography>
      </Box>

      {/* Empty State */}
      {tasks.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <TaskAltIcon
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
            No tasks yet
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "text.secondary",
            }}
          >
            Create your first task to start tracking work inside this project.
          </Typography>
        </Paper>
      )}

      {/* Task Cards */}
      {tasks.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Box>
      )}
    </Stack>
  );
}

export default TaskList;