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

import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { useQuery } from "@apollo/client/react";
import WorkspaceCard from "../../components/workspace/workspacecard";
import CreateWorkspaceForm from "../../components/workspace/workspaceform";
import { GET_ALL_WORKSPCAES } from "../../graphql/queries/workspaceQueries";

type Workspace = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

type GetWorkspacesResponse = {
  getallworkspaces: Workspace[];
};

function WorkspaceListPage() {
  const { data, loading, error, refetch } =
    useQuery<GetWorkspacesResponse>(GET_ALL_WORKSPCAES);

  const workspaces = data?.getallworkspaces ?? [];

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
              Loading your workspaces...
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
            Something went wrong while loading workspaces. {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack sx={{ gap: 4 }}>
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
                <WorkspacesIcon color="primary" fontSize="large" />

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Workspaces
                </Typography>
              </Stack>

              <Typography
                sx={{
                  mt: 1,
                  color: "text.secondary",
                }}
              >
                Manage your teams, projects, tasks, comments, dependencies, and
                activity logs from one place.
              </Typography>
            </Box>
          </Stack>

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
              Create a new workspace
            </Typography>

            <Typography
              sx={{
                mb: 2,
                color: "text.secondary",
              }}
            >
              Start by creating a workspace for your team or project.
            </Typography>

            <CreateWorkspaceForm onCreated={() => void refetch()} />
          </Paper>

          <Divider />

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
              }}
            >
              Your Workspaces
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {workspaces.length} workspace
              {workspaces.length === 1 ? "" : "s"} available
            </Typography>
          </Box>

          {workspaces.length === 0 && (
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
              <WorkspacesIcon
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
                No workspaces yet
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "text.secondary",
                }}
              >
                Create your first workspace to start managing projects and tasks.
              </Typography>
            </Paper>
          )}

          {workspaces.length > 0 && (
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
              {workspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </Box>
          )}
        </Stack>
      </Box>
    </Container>
  );
}

export default WorkspaceListPage;