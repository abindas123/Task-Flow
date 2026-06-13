import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { getProjectById } from "../../graphql/queries/projectQueries";
import TaskList from "../../components/task/tasklist";

import { GET_ACTIVITY_LOGS_BY_PROJECT } from "../../graphql/queries/activitylogsQueries";
import ActivityLogList from "../../components/activitylogs/activitylogs";

type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";

type Project = {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type GetProjectByIdResponse = {
  getProjectById: Project;
};

type GetProjectByIdVariables = {
  id: string;
};

type ActivityLog = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  task_id: string | null;
  actor_id: string;
  actor_name: string | null;
  activity_type: string;
  payload_json: any;
  created_at: string | null;
};

type GetActivityLogsByProjectResponse = {
  GetActivityLogsByProject: ActivityLog[];
};

type GetActivityLogsByProjectVariables = {
  project_id: string;
};

function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<
    GetProjectByIdResponse,
    GetProjectByIdVariables
  >(getProjectById, {
    variables: {
      id: projectId || "",
    },
    skip: !projectId,
  });

  const {
    data: activityData,
    loading: activityLoading,
    error: activityError,
  } = useQuery<
    GetActivityLogsByProjectResponse,
    GetActivityLogsByProjectVariables
  >(GET_ACTIVITY_LOGS_BY_PROJECT, {
    variables: {
      project_id: projectId || "",
    },
    skip: !projectId,
  });

  if (!projectId) {
    return <Alert severity="error">Project ID is missing</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const project = data?.getProjectById;

  if (!project) {
    return <Alert severity="warning">Project not found</Alert>;
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() =>
            navigate(`/workspaces/${project.workspace_id}/projects`)
          }
        >
          Back to Projects
        </Button>

        <Stack spacing={2}>
          <Typography variant="h4">{project.name}</Typography>

          <Typography variant="body1" color="text.secondary">
            {project.description || "No description"}
          </Typography>

          <Chip
            label={project.status}
            color={
              project.status === "ACTIVE"
                ? "success"
                : project.status === "ON_HOLD"
                ? "warning"
                : "default"
            }
            sx={{ width: "fit-content" }}
          />

          <Typography variant="body2">
            <strong>Project ID:</strong> {project.id}
          </Typography>

          <Typography variant="body2">
            <strong>Workspace ID:</strong> {project.workspace_id}
          </Typography>

          <Typography variant="body2">
            <strong>Created By:</strong> {project.created_by}
          </Typography>

          <Typography variant="body2">
            <strong>Created At:</strong> {project.created_at}
          </Typography>

          <Typography variant="body2">
            <strong>Updated At:</strong> {project.updated_at}
          </Typography>
        </Stack>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Tasks
          </Typography>

          <Box sx={{ mt: 3 }}>
            <TaskList
              project_id={projectId}
              workspace_id={project.workspace_id}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ mb: 2 }}>
          Activity Log
        </Typography>

        {activityLoading && <CircularProgress />}

        {activityError && (
          <Alert severity="error">{activityError.message}</Alert>
        )}

        {!activityLoading && !activityError && (
          <ActivityLogList
            logs={activityData?.GetActivityLogsByProject ?? []}
          />
        )}
      </Box>
    </Container>
  );
}

export default ProjectDetailPage;