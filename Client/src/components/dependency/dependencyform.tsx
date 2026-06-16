import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddLinkIcon from "@mui/icons-material/AddLink";
import { useMutation } from "@apollo/client/react";
import { CREATE_DEPENDENCY } from "../../graphql/mutations/dependencymutations";

type ProjectTask = {
  id: string;
  title: string;
};

type Dependency = {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: string;
  created_at: string | null;
};

type CreateDependencyResponse = {
  CreateDependency: Dependency;
};

type CreateDependencyVariables = {
  task_id: string;
  depends_on_task_id: string;
};

type DependencyFormProps = {
  taskId: string;
  projectTasks: ProjectTask[];
  onCreated: () => void;
};

function DependencyForm({
  taskId,
  projectTasks,
  onCreated,
}: DependencyFormProps) {
  const [dependsOnTaskId, setDependsOnTaskId] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const [createDependencyMutation, { loading, error }] = useMutation<
    CreateDependencyResponse,
    CreateDependencyVariables
  >(CREATE_DEPENDENCY);

  const availableTasks = projectTasks.filter((task) => task.id !== taskId);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setLocalError("");
    setSuccess(false);

    if (!taskId) {
      setLocalError("Current task ID is missing.");
      return;
    }

    if (!dependsOnTaskId) {
      setLocalError("Please select a task dependency.");
      return;
    }

    await createDependencyMutation({
      variables: {
        task_id: taskId,
        depends_on_task_id: dependsOnTaskId,
      },
    });

    setDependsOnTaskId("");
    setSuccess(true);
    onCreated();
  }

  return (
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
      <form onSubmit={handleSubmit}>
        <Stack sx={{ gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Add dependency
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.95rem",
            }}
          >
            Select another task that must be completed before this task can move
            forward.
          </Typography>

          {localError && <Alert severity="warning">{localError}</Alert>}

          {error && (
            <Alert severity="error">
              Something went wrong while adding dependency. {error.message}
            </Alert>
          )}

          {success && (
            <Alert severity="success">Dependency added successfully.</Alert>
          )}

          {availableTasks.length === 0 ? (
            <Alert severity="info">
              No other tasks are available in this project. Create more tasks
              before adding dependencies.
            </Alert>
          ) : (
            <TextField
              select
              label="This task is blocked by"
              value={dependsOnTaskId}
              onChange={(e) => setDependsOnTaskId(e.target.value)}
              fullWidth
              disabled={loading}
              helperText="Choose the task that blocks the current task"
            >
              {availableTasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.title}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !dependsOnTaskId || availableTasks.length === 0}
            startIcon={
              loading ? <CircularProgress size={18} /> : <AddLinkIcon />
            }
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
          >
            {loading ? "Adding..." : "Add Dependency"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default DependencyForm;