import { useState } from "react";
import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROJECT } from "../../graphql/mutations/projectmutations";

type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";

type CreateProjectResponse = {
  createProject: {
    id: string;
    name: string;
    description: string | null;
    workspace_id: string;
    status: ProjectStatus;
    created_by: string;
    created_at: string;
    updated_at: string;
  };
};

type CreateProjectVariables = {
  name: string;
  description: string | null;
  workspace_id: string;
  status: ProjectStatus;
};

type ProjectFormProps = {
  workspace_id: string;
  onCreated: () => void;
};

function ProjectForm({ workspace_id, onCreated }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE");

  const [createProject, { loading, error }] =
    useMutation<CreateProjectResponse, CreateProjectVariables>(CREATE_PROJECT);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    await createProject({
      variables: {
        name: name.trim(),
        description: description.trim() || null,
        workspace_id,
        status,
      },
    });

    setName("");
    setDescription("");
    setStatus("ACTIVE");

    onCreated();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error.message}</Alert>}

        <TextField
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          fullWidth
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="ON_HOLD">On Hold</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </TextField>

        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </Button>
      </Stack>
    </form>
  );
}

export default ProjectForm;