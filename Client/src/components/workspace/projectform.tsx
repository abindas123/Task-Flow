import { useState } from "react";
import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const [createProject, { loading, error }] =
    useMutation<CreateProjectResponse, CreateProjectVariables>(CREATE_PROJECT);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setLocalError("");
    setSuccess(false);

    if (!workspace_id) {
      setLocalError("Workspace ID is missing.");
      return;
    }

    if (!name.trim()) {
      setLocalError("Project name is required.");
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
    setSuccess(true);

    onCreated();
  }

  const isSubmitDisabled = loading || !name.trim() || !workspace_id;

  return (
    <form onSubmit={handleSubmit}>
      <Stack sx={{ gap: 2 }}>
        {localError && <Alert severity="warning">{localError}</Alert>}

        {error && (
          <Alert severity="error">
            Something went wrong while creating the project. {error.message}
          </Alert>
        )}

        {success && (
          <Alert severity="success">Project created successfully.</Alert>
        )}

        <TextField
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          placeholder="Example: Website Redesign"
          disabled={loading}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="Shortly describe what this project is about"
          disabled={loading}
        />

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          fullWidth
          disabled={loading}
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="ON_HOLD">On Hold</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </TextField>

        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitDisabled}
          startIcon={<AddIcon />}
          sx={{
            alignSelf: { xs: "stretch", sm: "flex-start" },
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
        >
          {loading ? "Creating..." : "Create Project"}
        </Button>
      </Stack>
    </form>
  );
}

export default ProjectForm;