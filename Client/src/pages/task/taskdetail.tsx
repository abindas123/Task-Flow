import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CommentIcon from "@mui/icons-material/Comment";
import FlagIcon from "@mui/icons-material/Flag";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_TASK_BY_ID } from "../../graphql/queries/taskQueries";
import { UPDATE_TASK_STATUS } from "../../graphql/mutations/taskmutations";

import { GET_COMMENTS_BY_TASK } from "../../graphql/queries/commentQueries";
import CommentForm from "../../components/comment/commentform";
import CommentList from "../../components/comment/commentlist";

import { GET_TASK_OPTIONS_BY_PROJECT } from "../../graphql/queries/taskQueries";
import { GET_DEPENDENCIES_BY_TASK } from "../../graphql/queries/dependencyQueries";
import DependencyForm from "../../components/dependency/dependencyform";
import DependencyList from "../../components/dependency/dependencylist";

import { useAuth } from "../../context/Authcontext";

type ProjectTask = {
  id: string;
  title: string;
};

type GetTasksByProjectResponse = {
  Gettasksbyproject: ProjectTask[];
};

type GetTasksByProjectVariables = {
  project_id: string;
};

type Dependency = {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: string;
  created_at: string | null;
  task_title: string | null;
  depends_on_task_title: string | null;
};

type GetDependenciesByTaskResponse = {
  GetDependenciesByTask: Dependency[];
};

type GetDependenciesByTaskVariables = {
  task_id: string;
};

type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Task = {
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

type GetTaskByIdResponse = {
  Gettaskbyid: Task;
};

type GetTaskByIdVariables = {
  id: string;
};

type UpdateTaskStatusResponse = {
  Updatetaskstatus: Task;
};

type UpdateTaskStatusVariables = {
  id: string;
  status: TaskStatus;
};

type Comment = {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
  Updated_at: string;
};

type GetCommentsByTaskResponse = {
  Getcommentsbytask: Comment[];
};

type GetCommentsByTaskVariables = {
  task_id: string;
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function formatDate(value: string | number | null) {
  if (!value) return "No date";

  const dateValue = Number(value);

  const date = Number.isNaN(dateValue)
    ? new Date(value)
    : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

function TaskDetailPage() {
  const { workspaceId, projectId, taskId } = useParams<{
    workspaceId: string;
    projectId: string;
    taskId: string;
  }>();

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: projectTasksData,
    loading: projectTasksLoading,
    error: projectTasksError,
  } = useQuery<GetTasksByProjectResponse, GetTasksByProjectVariables>(
    GET_TASK_OPTIONS_BY_PROJECT,
    {
      variables: {
        project_id: projectId || "",
      },
      skip: !projectId,
    }
  );

  const {
    data: dependencyData,
    loading: dependencyLoading,
    error: dependencyError,
    refetch: refetchDependencies,
  } = useQuery<GetDependenciesByTaskResponse, GetDependenciesByTaskVariables>(
    GET_DEPENDENCIES_BY_TASK,
    {
      variables: {
        task_id: taskId || "",
      },
      skip: !taskId,
    }
  );

  const { data, loading, error, refetch } = useQuery<
    GetTaskByIdResponse,
    GetTaskByIdVariables
  >(GET_TASK_BY_ID, {
    variables: {
      id: taskId || "",
    },
    skip: !taskId,
  });

  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery<GetCommentsByTaskResponse, GetCommentsByTaskVariables>(
    GET_COMMENTS_BY_TASK,
    {
      variables: {
        task_id: taskId || "",
      },
      skip: !taskId,
    }
  );

  const [updateTaskStatus, { loading: statusLoading, error: statusError }] =
    useMutation<UpdateTaskStatusResponse, UpdateTaskStatusVariables>(
      UPDATE_TASK_STATUS
    );

  if (!workspaceId || !projectId || !taskId) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Task route information is missing.</Alert>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">You must be logged in to view this task.</Alert>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack sx={{ alignItems: "center", gap: 2 }}>
            <CircularProgress />
            <Typography sx={{ color: "text.secondary" }}>
              Loading task details...
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Something went wrong while loading this task. {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  const task = data?.Gettaskbyid;

  if (!task) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">Task not found.</Alert>
        </Box>
      </Container>
    );
  }

  async function handleStatusChange(status: TaskStatus) {
    await updateTaskStatus({
      variables: {
        id: taskId!,
        status,
      },
    });

    await refetch();
  }

  const dependencies = dependencyData?.GetDependenciesByTask ?? [];
  const comments = commentsData?.Getcommentsbytask ?? [];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack sx={{ gap: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              alignSelf: "flex-start",
            }}
            onClick={() =>
              navigate(`/workspaces/${workspaceId}/projects/${projectId}`)
            }
          >
            Back to Project
          </Button>

          {/* Task Header */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Stack sx={{ gap: 3 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", md: "center" },
                  gap: 2,
                }}
              >
                <Box>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <TaskAltIcon color="primary" fontSize="large" />

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {task.title}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      mt: 1,
                      color: "text.secondary",
                      maxWidth: 850,
                    }}
                  >
                    {task.description || "No description added for this task."}
                  </Typography>
                </Box>

                <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={formatLabel(task.status)}
                    color={getStatusColor(task.status)}
                    sx={{ fontWeight: 600 }}
                  />

                  <Chip
                    label={formatLabel(task.priority)}
                    color={getPriorityColor(task.priority)}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
              </Stack>

              <Divider />

              {statusError && (
                <Alert severity="error">
                  Something went wrong while updating status.{" "}
                  {statusError.message}
                </Alert>
              )}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "300px 1fr",
                  },
                  gap: 3,
                }}
              >
                <TextField
                  select
                  label="Update Status"
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as TaskStatus)
                  }
                  disabled={statusLoading}
                  fullWidth
                >
                  <MenuItem value="BACKLOG">Backlog</MenuItem>
                  <MenuItem value="TODO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="IN_REVIEW">In Review</MenuItem>
                  <MenuItem value="BLOCKED">Blocked</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                </TextField>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: "center", gap: 1.5 }}
                    >
                      <PersonIcon color="primary" />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: "text.secondary",
                          }}
                        >
                          Assignee
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {task.assignee_id ? "Assigned" : "Unassigned"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: "center", gap: 1.5 }}
                    >
                      <CalendarMonthIcon color="primary" />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: "text.secondary",
                          }}
                        >
                          Due Date
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {formatDate(task.due_date)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: "center", gap: 1.5 }}
                    >
                      <FlagIcon color="primary" />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: "text.secondary",
                          }}
                        >
                          Priority
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {formatLabel(task.priority)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Dependencies */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Stack sx={{ gap: 3 }}>
              <Box>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <LinkIcon color="primary" />

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Dependencies
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "text.secondary",
                  }}
                >
                  Show which tasks block this task or depend on this task.
                </Typography>
              </Box>

              {projectTasksLoading || dependencyLoading ? (
                <Stack sx={{ alignItems: "center", gap: 2, py: 3 }}>
                  <CircularProgress />
                  <Typography sx={{ color: "text.secondary" }}>
                    Loading dependencies...
                  </Typography>
                </Stack>
              ) : (
                <>
                  {projectTasksError && (
                    <Alert severity="error">
                      Something went wrong while loading project tasks.{" "}
                      {projectTasksError.message}
                    </Alert>
                  )}

                  {dependencyError && (
                    <Alert severity="error">
                      Something went wrong while loading dependencies.{" "}
                      {dependencyError.message}
                    </Alert>
                  )}

                  {!projectTasksError && !dependencyError && (
                    <>
                      <DependencyForm
                        taskId={taskId}
                        projectTasks={projectTasksData?.Gettasksbyproject ?? []}
                        onCreated={() => void refetchDependencies()}
                      />

                      <DependencyList
                        taskId={taskId}
                        dependencies={dependencies}
                        onChanged={() => void refetchDependencies()}
                      />
                    </>
                  )}
                </>
              )}
            </Stack>
          </Paper>

          {/* Comments */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Stack sx={{ gap: 3 }}>
              <Box>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CommentIcon color="primary" />

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Comments
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "text.secondary",
                  }}
                >
                  Discuss progress, blockers, and implementation details for
                  this task.
                </Typography>
              </Box>

              <CommentForm
                taskId={taskId}
                authorId={user.id}
                onCreated={() => void refetchComments()}
              />

              {commentsLoading && (
                <Stack sx={{ alignItems: "center", gap: 2, py: 3 }}>
                  <CircularProgress />
                  <Typography sx={{ color: "text.secondary" }}>
                    Loading comments...
                  </Typography>
                </Stack>
              )}

              {commentsError && (
                <Alert severity="error">
                  Something went wrong while loading comments.{" "}
                  {commentsError.message}
                </Alert>
              )}

              {!commentsLoading && !commentsError && (
                <CommentList
                  comments={comments}
                  onChanged={() => void refetchComments()}
                />
              )}
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}

export default TaskDetailPage;