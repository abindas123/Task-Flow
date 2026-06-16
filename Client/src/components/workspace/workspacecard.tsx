import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import WorkspacesIcon from "@mui/icons-material/Workspaces";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";

type WorkspaceCardProps = {
  workspace: {
    id: string;
    name: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent>
        <Stack sx={{ gap: 2 }}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WorkspacesIcon />
            </Box>

            <Chip label="Workspace" size="small" color="primary" />
          </Stack>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {workspace.name}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.95rem",
                minHeight: 48,
              }}
            >
              {workspace.description || "No description added for this workspace."}
            </Typography>
          </Box>

          <Divider />

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.85rem",
            }}
          >
            Updated: {formatDate(workspace.updated_at)}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          component={RouterLink}
          to={`/workspaces/${workspace.id}/projects`}
          endIcon={<ArrowForwardIcon />}
        >
          Open Workspace
        </Button>
      </CardActions>
    </Card>
  );
}

export default WorkspaceCard;