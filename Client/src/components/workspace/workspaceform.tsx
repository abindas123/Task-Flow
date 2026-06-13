import { useState } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
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
  owner_id:string
};

function CreateWorkspaceForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();

  const [createWorkspace, { loading, error }] =
    useMutation<CreateWorkspaceResponse, CreateWorkspaceVariables>(
      CREATE_WORKSPACE
    );
    
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
  if (!user) {
    return; // or show error
  }
    await createWorkspace({
      variables: {
        name,
        description: description || null,
        owner_id:user?.id
      },
    });

    setName("");
    setDescription("");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error.message}</Alert>}

        <TextField
          label="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Workspace"}
        </Button>
      </Stack>
    </form>
  );
}

export default CreateWorkspaceForm;