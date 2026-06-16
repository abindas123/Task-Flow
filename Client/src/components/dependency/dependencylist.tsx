import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

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

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

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
    <Stack sx={{ gap: 3 }}>
      {error && (
        <Alert severity="error">
          Something went wrong while removing dependency. {error.message}
        </Alert>
      )}

      {/* Blocked By Section */}
      <Box>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <ReportProblemOutlinedIcon color="warning" />

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              This task is blocked by
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.9rem",
              }}
            >
              These tasks must be completed before this task can move forward.
            </Typography>
          </Box>
        </Stack>

        {blockedBy.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              bgcolor: "background.default",
            }}
          >
            <Typography sx={{ color: "text.secondary" }}>
              This task is not blocked by any other task.
            </Typography>
          </Paper>
        ) : (
          <Stack sx={{ gap: 2 }}>
            {blockedBy.map((dependency) => (
              <Paper
                key={dependency.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  bgcolor: "background.default",
                }}
              >
                <Stack sx={{ gap: 2 }}>
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
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <LinkIcon color="primary" />

                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {dependency.depends_on_task_title ||
                            "Unknown blocking task"}
                        </Typography>

                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.9rem",
                          }}
                        >
                          This task must be finished first.
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip
                      label={formatLabel(dependency.dependency_type)}
                      size="small"
                      color="warning"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <DeleteIcon />
                      )
                    }
                    onClick={() => handleDelete(dependency.id)}
                    disabled={loading}
                    sx={{
                      alignSelf: { xs: "stretch", sm: "flex-start" },
                    }}
                  >
                    Remove Dependency
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      <Divider />

      {/* Blocking Section */}
      <Box>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <SyncAltIcon color="primary" />

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              This task is blocking
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.9rem",
              }}
            >
              These tasks are waiting for the current task to be completed.
            </Typography>
          </Box>
        </Stack>

        {blocking.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              bgcolor: "background.default",
            }}
          >
            <Typography sx={{ color: "text.secondary" }}>
              No other tasks are waiting for this task.
            </Typography>
          </Paper>
        ) : (
          <Stack sx={{ gap: 2 }}>
            {blocking.map((dependency) => (
              <Paper
                key={dependency.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  bgcolor: "background.default",
                }}
              >
                <Stack sx={{ gap: 2 }}>
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
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <LinkIcon color="primary" />

                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {dependency.task_title || "Unknown dependent task"}
                        </Typography>

                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.9rem",
                          }}
                        >
                          This task depends on the current task.
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip
                      label={formatLabel(dependency.dependency_type)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} />
                      ) : (
                            <DeleteIcon />
                      )
                    }
                    onClick={() => handleDelete(dependency.id)}
                    disabled={loading}
                    sx={{
                      alignSelf: { xs: "stretch", sm: "flex-start" },
                    }}
                  >
                    Remove Dependency
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