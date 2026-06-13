import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { DELETE_DEPENDENCY } from "../../graphql/mutations/dependencymutations";

type Dependency = {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: string;
  created_at: string | null;
  task_title: string | null;
  depends_on_task_title: string | null;
};

type DeleteDependencyResponse = {
  DeleteDependency: Dependency;
};

type DeleteDependencyVariables = {
  id: string;
};

type DependencyListProps = {
  taskId: string;
  dependencies: Dependency[];
  onChanged: () => void;
};

function DependencyList({
  taskId,
  dependencies,
  onChanged,
}: DependencyListProps) {
  const [deleteDependencyMutation, { loading, error }] = useMutation<
    DeleteDependencyResponse,
    DeleteDependencyVariables
  >(DELETE_DEPENDENCY);

  const blockedBy = dependencies.filter(
    (dependency) => dependency.task_id === taskId
  );

  const blocking = dependencies.filter(
    (dependency) => dependency.depends_on_task_id === taskId
  );

  async function handleDelete(id: string) {
    await deleteDependencyMutation({
      variables: {
        id,
      },
    });

    onChanged();
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error.message}</Alert>}

      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Blocked by
        </Typography>

        {blockedBy.length === 0 ? (
          <Typography color="text.secondary">
            This task is not blocked by any task.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {blockedBy.map((dependency) => (
              <Paper key={dependency.id} sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography>
                    This task is blocked by:{" "}
                    <strong>
                      {dependency.depends_on_task_title ||
                        dependency.depends_on_task_id}
                    </strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Type: {dependency.dependency_type}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(dependency.id)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : "Remove"}
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Blocking
        </Typography>

        {blocking.length === 0 ? (
          <Typography color="text.secondary">
            No other tasks are waiting for this task.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {blocking.map((dependency) => (
              <Paper key={dependency.id} sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography>
                    This task is blocking:{" "}
                    <strong>
                      {dependency.task_title || dependency.task_id}
                    </strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Type: {dependency.dependency_type}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(dependency.id)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : "Remove"}
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export default DependencyList;