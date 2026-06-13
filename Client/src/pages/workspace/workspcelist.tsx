import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Workspaces
        </Typography>

        <Box sx={{ mb: 4 }}>
          <CreateWorkspaceForm onCreated={refetch} />
        </Box>

       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
  {data?.getallworkspaces.map((workspace) => (
    <Box key={workspace.id} sx={{ width: "300px" }}>
      <WorkspaceCard workspace={workspace} />
    </Box>
  ))}
</Box>
      </Box>
    </Container>
  );
}

export default WorkspaceListPage;