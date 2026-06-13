import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
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

function TaskList({ project_id,workspace_id }: TaskListProps) {
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
    return <Alert severity="error">Project ID missing</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const tasks = data?.Gettasksbyproject || [];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Tasks
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TaskForm project_id={project_id} workspace_id={workspace_id} onCreated={refetch} />
      </Box>

      {tasks.length === 0 ? (
        <Alert severity="info">No tasks created yet.</Alert>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {tasks.map((task) => (
            <Box key={task.id} sx={{ width: "300px" }}>
              <TaskCard task={task} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default TaskList;