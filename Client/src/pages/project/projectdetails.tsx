import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import HistoryIcon from "@mui/icons-material/History";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ProjectAIAssistant from "../../components/Ai/ProjectAiassistant";

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

function getStatusColor(status: ProjectStatus) {
  if (status === "ACTIVE") return "success";
  if (status === "ON_HOLD") return "warning";
  return "default";
}

function formatDate(date?: string | null) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Project ID is missing.</Alert>
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
              Loading project details...
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
            Something went wrong while loading this project. {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  const project = data?.getProjectById;

  if (!project) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">Project not found.</Alert>
        </Box>
      </Container>
    );
  }

  const activityLogs = activityData?.GetActivityLogsByProject ?? [];

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
              navigate(`/workspaces/${project.workspace_id}/projects`)
            }
          >
            Back to Projects
          </Button>

          {/* Project Header */}
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
                    <FolderOpenIcon color="primary" fontSize="large" />

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {project.name}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      mt: 1,
                      color: "text.secondary",
                      maxWidth: 800,
                    }}
                  >
                    {project.description ||
                      "No description added for this project."}
                  </Typography>
                </Box>

                <Chip
                  label={project.status.replace("_", " ")}
                  color={getStatusColor(project.status)}
                  sx={{
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Divider />

              {/* Project Meta Info */}
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
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
                    <CalendarMonthIcon color="primary" />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: "text.secondary",
                        }}
                      >
                        Created
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        {formatDate(project.created_at)}
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
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
                    <CalendarMonthIcon color="primary" />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: "text.secondary",
                        }}
                      >
                        Updated
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        {formatDate(project.updated_at)}
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
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
                    <InfoOutlinedIcon color="primary" />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: "text.secondary",
                        }}
                      >
                        Activity Logs
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        {activityLogs.length} log
                        {activityLogs.length === 1 ? "" : "s"}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Stack>
          </Paper>
          {projectId && <ProjectAIAssistant projectId={projectId} />}

          {/* Tasks Section */}
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
                  <AssignmentIcon color="primary" />

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Tasks
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "text.secondary",
                  }}
                >
                  Create, assign, update, and track tasks inside this project.
                </Typography>
              </Box>

              <TaskList
                project_id={projectId}
                workspace_id={project.workspace_id}
              />
            </Stack>
          </Paper>

          {/* Activity Log Section */}
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
                  <HistoryIcon color="primary" />

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Activity Log
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "text.secondary",
                  }}
                >
                  Recent project activity such as task creation, comments,
                  status changes, and dependencies.
                </Typography>
              </Box>

              {activityLoading && (
                <Stack sx={{ alignItems: "center", gap: 2, py: 3 }}>
                  <CircularProgress />
                  <Typography sx={{ color: "text.secondary" }}>
                    Loading activity logs...
                  </Typography>
                </Stack>
              )}

              {activityError && (
                <Alert severity="error">
                  Something went wrong while loading activity logs.{" "}
                  {activityError.message}
                </Alert>
              )}

              {!activityLoading && !activityError && (
                <ActivityLogList logs={activityLogs} />
              )}
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}

export default ProjectDetailPage;