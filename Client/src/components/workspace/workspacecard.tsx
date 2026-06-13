import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type WorkspaceCardProps = {
  workspace: {
    id: string;
    name: string;
    description?: string | null;
  };
};

function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{workspace.name}</Typography>

        <Typography color="text.secondary" sx={{mb:2}}>
          {workspace.description || "No description"}
        </Typography>

       <Button
  variant="outlined"
  component={RouterLink}
  to={`/workspaces/${workspace.id}/projects`}
>
  Open
</Button>
      </CardContent>
    </Card>
  );
}

export default WorkspaceCard;