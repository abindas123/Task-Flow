import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
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

  if (!workspaceId) {
    return <Alert severity="error">Workspace ID is missing</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Projects
        </Typography>

        <Box sx={{ mb: 4 }}>
          <ProjectForm workspace_id={workspaceId} onCreated={refetch} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {data?.getProjectsByWorkspace.map((project) => (
            <Box key={project.id} sx={{ width: "300px" }}>
              <ProjectCard project={project} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
export default ProjectListPage;