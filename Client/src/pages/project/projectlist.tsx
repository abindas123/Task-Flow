import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import ProjectForm from "../../components/workspace/projectform";
import ProjectCard from "../../components/workspace/projectcard";
import { getProjectbyworkspace } from "../../graphql/queries/projectQueries";

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

type GetProjectsByWorkspaceResponse = {
  getProjectsByWorkspace: Project[];
};

type GetProjectsByWorkspaceVariables = {
  workspace_id: string;
};

function ProjectListPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data, loading, error, refetch } = useQuery<
    GetProjectsByWorkspaceResponse,
    GetProjectsByWorkspaceVariables
  >(getProjectbyworkspace, {
    variables: {
      workspace_id: workspaceId || "",
    },
    skip: !workspaceId,
  });

  const projects = data?.getProjectsByWorkspace ?? [];

  if (!workspaceId) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Workspace ID is missing.</Alert>
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
              Loading projects...
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
            Something went wrong while loading projects. {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack sx={{ gap: 4 }}>
          {/* Page Header */}
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
                Projects
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 1,
                color: "text.secondary",
              }}
            >
              Manage projects inside this workspace. Track tasks, comments,
              dependencies, and activity logs.
            </Typography>
          </Box>

          {/* Create Project Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 600,
              }}
            >
              Create a new project
            </Typography>

            <Typography
              sx={{
                mb: 2,
                color: "text.secondary",
              }}
            >
              Add a project to organize tasks and track work inside this
              workspace.
            </Typography>

            <ProjectForm
              workspace_id={workspaceId}
              onCreated={() => void refetch()}
            />
          </Paper>

          <Divider />

          {/* Project List Header */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
              }}
            >
              Workspace Projects
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {projects.length} project{projects.length === 1 ? "" : "s"}{" "}
              available
            </Typography>
          </Box>

          {/* Empty State */}
          {projects.length === 0 && (
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
              <ViewKanbanIcon
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
                No projects yet
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "text.secondary",
                }}
              >
                Create your first project to start adding and managing tasks.
              </Typography>
            </Paper>
          )}

          {/* Project Cards */}
          {projects.length > 0 && (
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
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Box>
          )}
        </Stack>
      </Box>
    </Container>
  );
}

export default ProjectListPage;