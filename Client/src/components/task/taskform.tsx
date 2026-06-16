import { useState } from "react";
import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
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
  created_at?: string;
  joined_at?: string;
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

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function TaskForm({ project_id, workspace_id, onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

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

    setLocalError("");
    setSuccess(false);

    if (!project_id) {
      setLocalError("Project ID is missing.");
      return;
    }

    if (!workspace_id) {
      setLocalError("Workspace ID is missing.");
      return;
    }

    if (!title.trim()) {
      setLocalError("Task title is required.");
      return;
    }

    await createTask({
      variables: {
        title: title.trim(),
        description: description.trim() || null,
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
    setSuccess(true);

    onCreated();
  }

  const members = membersData?.getWorkspaceMembers ?? [];
  const isSubmitDisabled = loading || !title.trim() || !project_id;

  return (
    <form onSubmit={handleSubmit}>
      <Stack sx={{ gap: 2 }}>
        {localError && <Alert severity="warning">{localError}</Alert>}

        {error && (
          <Alert severity="error">
            Something went wrong while creating the task. {error.message}
          </Alert>
        )}

        {membersError && (
          <Alert severity="error">
            Something went wrong while loading workspace members.{" "}
            {membersError.message}
          </Alert>
        )}

        {success && <Alert severity="success">Task created successfully.</Alert>}

        <TextField
          label="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          placeholder="Example: Build login page"
          disabled={loading}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
          placeholder="Describe the task, goal, or expected outcome"
          disabled={loading}
        />

        <TextField
          select
          label="Assignee"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          fullWidth
          disabled={loading || membersLoading}
          helperText={
            membersLoading
              ? "Loading workspace members..."
              : "Assign this task to a workspace member"
          }
        >
          <MenuItem value="">Unassigned</MenuItem>

          {members.map((member) => (
            <MenuItem key={member.user_id} value={member.user_id}>
              {member.role} - {member.user_id}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          fullWidth
          disabled={loading}
        >
          <MenuItem value="BACKLOG">Backlog</MenuItem>
          <MenuItem value="TODO">To Do</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="IN_REVIEW">In Review</MenuItem>
          <MenuItem value="BLOCKED">Blocked</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
        </TextField>

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          fullWidth
          disabled={loading}
        >
          <MenuItem value="LOW">{formatLabel("LOW")}</MenuItem>
          <MenuItem value="MEDIUM">{formatLabel("MEDIUM")}</MenuItem>
          <MenuItem value="HIGH">{formatLabel("HIGH")}</MenuItem>
          <MenuItem value="URGENT">{formatLabel("URGENT")}</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="Due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          disabled={loading}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitDisabled}
          startIcon={<AddTaskIcon />}
          sx={{
            alignSelf: { xs: "stretch", sm: "flex-start" },
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
        >
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </Stack>
    </form>
  );
}

export default TaskForm;