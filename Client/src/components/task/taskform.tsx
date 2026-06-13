import { useState } from "react";
import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client/react";

import { CREATE_TASK } from "../../graphql/mutations/taskmutations";
import { GET_WORKSPACE_MEMBERS } from "../../graphql/queries/workspaceQueries";

type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  assignee_id: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type CreateTaskResponse = {
  Createtask: Task;
};

type CreateTaskVariables = {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  assignee_id?: string | null;
  due_date?: string | null;
};

type WorkspaceMember = {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  created_at: string;
};

type GetWorkspaceMembersResponse = {
  getWorkspaceMembers: WorkspaceMember[];
};

type GetWorkspaceMembersVariables = {
  workspace_id: string;
};

type TaskFormProps = {
  project_id: string;
  workspace_id: string;
  onCreated: () => void;
};

function TaskForm({ project_id, workspace_id, onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const {
    data: membersData,
    loading: membersLoading,
    error: membersError,
  } = useQuery<GetWorkspaceMembersResponse, GetWorkspaceMembersVariables>(
    GET_WORKSPACE_MEMBERS,
    {
      variables: {
        workspace_id,
      },
      skip: !workspace_id,
    }
  );

  const [createTask, { loading, error }] = useMutation<
    CreateTaskResponse,
    CreateTaskVariables
  >(CREATE_TASK);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await createTask({
      variables: {
        title,
        description: description || null,
        status,
        priority,
        project_id,
        assignee_id: assigneeId || null,
        due_date: dueDate || null,
      },
    });

    setTitle("");
    setDescription("");
    setAssigneeId("");
    setStatus("TODO");
    setPriority("MEDIUM");
    setDueDate("");

    onCreated();
  }

  const members = membersData?.getWorkspaceMembers || [];

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error.message}</Alert>}

        {membersError && (
          <Alert severity="error">{membersError.message}</Alert>
        )}

        <TextField
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />

        <TextField
          select
          label="Assignee"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          disabled={membersLoading}
        >
          <MenuItem value="">Unassigned</MenuItem>

          {members.map((member) => (
            <MenuItem key={member.user_id} value={member.user_id}>
              {member.user_id} - {member.role}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          <MenuItem value="BACKLOG">BACKLOG</MenuItem>
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
          <MenuItem value="IN_REVIEW">IN_REVIEW</MenuItem>
          <MenuItem value="BLOCKED">BLOCKED</MenuItem>
          <MenuItem value="DONE">DONE</MenuItem>
        </TextField>

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <MenuItem value="LOW">LOW</MenuItem>
          <MenuItem value="MEDIUM">MEDIUM</MenuItem>
          <MenuItem value="HIGH">HIGH</MenuItem>
          <MenuItem value="URGENT">URGENT</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </Stack>
    </form>
  );
}

export default TaskForm;