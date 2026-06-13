import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
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

function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{project.name}</Typography>

          <Typography variant="body2" color="text.secondary">
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
            size="small"
            sx={{ width: "fit-content" }}
          />

          <Button
  variant="outlined"
  size="small"
  onClick={() =>
    navigate(`/workspaces/${project.workspace_id}/projects/${project.id}`)
  }
>
  View Project
</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;