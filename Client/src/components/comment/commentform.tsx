import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import { useMutation } from "@apollo/client/react";
import { CREATE_COMMENT } from "../../graphql/mutations/commentmutations";

type Comment = {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

type CreateCommentResponse = {
  createComment: Comment;
};

type CreateCommentVariables = {
  task_id: string;
  author_id: string;
  body: string;
};

type CommentFormProps = {
  taskId: string;
  authorId: string;
  onCreated: () => void;
};

function CommentForm({ taskId, authorId, onCreated }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const [createCommentMutation, { loading, error }] = useMutation<
    CreateCommentResponse,
    CreateCommentVariables
  >(CREATE_COMMENT);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setLocalError("");
    setSuccess(false);

    if (!taskId) {
      setLocalError("Task ID is missing.");
      return;
    }

    if (!authorId) {
      setLocalError("Author ID is missing.");
      return;
    }

    if (!body.trim()) {
      setLocalError("Comment cannot be empty.");
      return;
    }

    await createCommentMutation({
      variables: {
        task_id: taskId,
        author_id: authorId,
        body: body.trim(),
      },
    });

    setBody("");
    setSuccess(true);
    onCreated();
  }

  const isSubmitDisabled = loading || !body.trim();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.default",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack sx={{ gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Add comment
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.95rem",
            }}
          >
            Share updates, blockers, implementation notes, or questions about
            this task.
          </Typography>

          {localError && <Alert severity="warning">{localError}</Alert>}

          {error && (
            <Alert severity="error">
              Something went wrong while adding the comment. {error.message}
            </Alert>
          )}

          {success && (
            <Alert severity="success">Comment added successfully.</Alert>
          )}

          <TextField
            label="Write a comment"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            minRows={3}
            fullWidth
            disabled={loading}
            placeholder="Example: Backend API is ready, but frontend validation still needs polish."
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitDisabled}
            startIcon={loading ? <CircularProgress size={18} /> : <SendIcon />}
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
          >
            {loading ? "Adding..." : "Add Comment"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default CommentForm;