import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
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

  const [createDependencyMutation, { loading, error }] = useMutation<
    CreateDependencyResponse,
    CreateDependencyVariables
  >(CREATE_DEPENDENCY);

  const availableTasks = projectTasks.filter((task) => task.id !== taskId);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!dependsOnTaskId) return;

    await createDependencyMutation({
      variables: {
        task_id: taskId,
        depends_on_task_id: dependsOnTaskId,
      },
    });

    setDependsOnTaskId("");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          select
          label="This task is blocked by"
          value={dependsOnTaskId}
          onChange={(e) => setDependsOnTaskId(e.target.value)}
          fullWidth
        >
          {availableTasks.map((task) => (
            <MenuItem key={task.id} value={task.id}>
              {task.title}
            </MenuItem>
          ))}
        </TextField>

        {error && <Alert severity="error">{error.message}</Alert>}

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !dependsOnTaskId}
        >
          {loading ? <CircularProgress size={24} /> : "Add Dependency"}
        </Button>
      </Stack>
    </form>
  );
}

export default DependencyForm;