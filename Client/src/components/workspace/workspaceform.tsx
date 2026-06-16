import { useState } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMutation } from "@apollo/client/react";
import { CREATE_WORKSPACE } from "../../graphql/mutations/workspacemutations";
import { useAuth } from "../../context/Authcontext";

type CreateWorkspaceResponse = {
  createWorkspace: {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    created_at: string;
    updated_at: string;
  };
};

type CreateWorkspaceVariables = {
  name: string;
  description?: string | null;
  owner_id: string;
};

function CreateWorkspaceForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();

  const [createWorkspace, { loading, error }] =
    useMutation<CreateWorkspaceResponse, CreateWorkspaceVariables>(
      CREATE_WORKSPACE
    );

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setLocalError("");
    setSuccess(false);

    if (!user) {
      setLocalError("You must be logged in to create a workspace.");
      return;
    }

    if (!name.trim()) {
      setLocalError("Workspace name is required.");
      return;
    }

    await createWorkspace({
      variables: {
        name: name.trim(),
        description: description.trim() || null,
        owner_id: user.id,
      },
    });

    setName("");
    setDescription("");
    setSuccess(true);
    onCreated();
  }

  const isSubmitDisabled = loading || !name.trim() || !user;

  return (
    <form onSubmit={handleSubmit}>
      <Stack sx={{ gap: 2 }}>
        {localError && <Alert severity="warning">{localError}</Alert>}

        {error && (
          <Alert severity="error">
            Something went wrong while creating the workspace. {error.message}
          </Alert>
        )}

        {success && (
          <Alert severity="success">Workspace created successfully.</Alert>
        )}

        <TextField
          label="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          placeholder="Example: Product Team"
          disabled={loading}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="Shortly describe what this workspace is used for"
          disabled={loading}
        />

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
          {loading ? "Creating..." : "Create Workspace"}
        </Button>
      </Stack>
    </form>
  );
}

export default CreateWorkspaceForm;