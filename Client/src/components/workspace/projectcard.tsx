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

import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

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

type ProjectCardProps = {
  project: Project;
};

function getStatusColor(status: ProjectStatus) {
  if (status === "ACTIVE") return "success";
  if (status === "ON_HOLD") return "warning";
  return "default";
}

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

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
              <ViewKanbanIcon />
            </Box>

            <Chip
              label={project.status.replace("_", " ")}
              color={getStatusColor(project.status)}
              size="small"
              sx={{
                fontWeight: 600,
              }}
            />
          </Stack>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {project.name}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.95rem",
                minHeight: 48,
              }}
            >
              {project.description || "No description added for this project."}
            </Typography>
          </Box>

          <Divider />

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.85rem",
            }}
          >
            Updated: {formatDate(project.updated_at)}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() =>
            navigate(`/workspaces/${project.workspace_id}/projects/${project.id}`)
          }
        >
          View Project
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProjectCard;