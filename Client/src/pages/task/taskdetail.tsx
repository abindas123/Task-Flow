import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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

function TaskDetailPage() {
  const { workspaceId, projectId, taskId } = useParams<{
    workspaceId: string;
    projectId: string;
    taskId: string;
  }>();
  const { user } = useAuth();
  if (!user) {
  return <Alert severity="error">You must be logged in to comment</Alert>;
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
    
      return date.toLocaleString();
    }
  const navigate = useNavigate();
  
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
    return <Alert severity="error">Task route information is missing</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const task = data?.Gettaskbyid;

  if (!task) {
    return <Alert severity="warning">Task not found</Alert>;
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

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() =>
            navigate(`/workspaces/${workspaceId}/projects/${projectId}`)
          }
        >
          Back to Project
        </Button>

        <Stack spacing={2}>
          <Typography variant="h4">{task.title}</Typography>

          <Typography variant="body1" color="text.secondary">
            {task.description || "No description"}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip label={task.status} />
            <Chip label={task.priority} />
          </Stack>

          {statusError && (
            <Alert severity="error">{statusError.message}</Alert>
          )}

          <TextField
            select
            label="Update Status"
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            disabled={statusLoading}
            sx={{ maxWidth: 300 }}
          >
            <MenuItem value="BACKLOG">BACKLOG</MenuItem>
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
            <MenuItem value="IN_REVIEW">IN_REVIEW</MenuItem>
            <MenuItem value="BLOCKED">BLOCKED</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </TextField>

          <Typography variant="body2">
            <strong>Task ID:</strong> {task.id}
          </Typography>

          <Typography variant="body2">
            <strong>Project ID:</strong> {task.project_id}
          </Typography>

          <Typography variant="body2">
            <strong>Assignee ID:</strong> {task.assignee_id || "Unassigned"}
          </Typography>

          <Typography variant="body2">
            <strong>Created By:</strong> {task.created_by}
          </Typography>

          <Typography variant="body2">
            <strong>Due Date:</strong> {formatDate(task.due_date)}
          </Typography>

          <Typography variant="body2">
            <strong>Created At:</strong> {formatDate(task.created_at)}
          </Typography>

          <Typography variant="body2">
            <strong>Updated At:</strong> {formatDate(task.updated_at)}
          </Typography>
          <Divider sx={{ my: 2 }} />

<Typography variant="h5">Dependencies</Typography>

{projectTasksLoading || dependencyLoading ? (
  <CircularProgress />
) : (
  <>
    {projectTasksError && (
      <Alert severity="error">{projectTasksError.message}</Alert>
    )}

    {dependencyError && (
      <Alert severity="error">{dependencyError.message}</Alert>
    )}

    {!projectTasksError && !dependencyError && (
      <>
        <DependencyForm
          taskId={taskId}
          projectTasks={projectTasksData?.Gettasksbyproject ?? []}
          onCreated={refetchDependencies}
        />

        <DependencyList
          taskId={taskId}
          dependencies={dependencyData?.GetDependenciesByTask ?? []}
          onChanged={refetchDependencies}
        />
      </>
    )}
  </>
)}
          <Divider sx={{ my: 2 }} />

          <Typography variant="h5">Comments</Typography>

          <CommentForm taskId={taskId} authorId={user.id} onCreated={refetchComments} />

          {commentsLoading && <CircularProgress />}

          {commentsError && (
            <Alert severity="error">{commentsError.message}</Alert>
          )}

          {!commentsLoading && !commentsError && (
            <CommentList
  comments={commentsData?.Getcommentsbytask ?? []}
  onChanged={refetchComments}
/>
          )}
        </Stack>
      </Box>
    </Container>
  );
}

export default TaskDetailPage;