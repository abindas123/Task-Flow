import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";

import { useMutation } from "@apollo/client/react";
import {
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from "../../graphql/mutations/commentmutations";

type Comment = {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at?: string;
  Updated_at?: string;
};

type UpdateCommentResponse = {
  updateComment: Comment;
};

type UpdateCommentVariables = {
  id: string;
  body: string;
};

type DeleteCommentResponse = {
  deleteComment: Comment;
};

type DeleteCommentVariables = {
  id: string;
};

type CommentListProps = {
  comments: Comment[];
  onChanged: () => void;
};

function formatDate(value: string | number | null | undefined) {
  if (!value) return "No date";

  const dateValue = Number(value);

  const date = Number.isNaN(dateValue)
    ? new Date(value)
    : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(id: string) {
  if (!id) return "Unknown user";
  return `User ${id.slice(0, 8)}`;
}

function CommentList({ comments, onChanged }: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedBody, setEditedBody] = useState("");
  const [localError, setLocalError] = useState("");

  const [updateCommentMutation, { loading: updating, error: updateError }] =
    useMutation<UpdateCommentResponse, UpdateCommentVariables>(UPDATE_COMMENT);

  const [deleteCommentMutation, { loading: deleting, error: deleteError }] =
    useMutation<DeleteCommentResponse, DeleteCommentVariables>(DELETE_COMMENT);

  function startEditing(comment: Comment) {
    setLocalError("");
    setEditingId(comment.id);
    setEditedBody(comment.body);
  }

  function cancelEditing() {
    setLocalError("");
    setEditingId(null);
    setEditedBody("");
  }

  async function handleUpdate(commentId: string) {
    setLocalError("");

    if (!editedBody.trim()) {
      setLocalError("Comment cannot be empty.");
      return;
    }

    await updateCommentMutation({
      variables: {
        id: commentId,
        body: editedBody.trim(),
      },
    });

    setEditingId(null);
    setEditedBody("");
    onChanged();
  }

  async function handleDelete(commentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    await deleteCommentMutation({
      variables: {
        id: commentId,
      },
    });

    onChanged();
  }

  if (comments.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "background.default",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          No comments yet
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "text.secondary",
          }}
        >
          Add the first comment to start discussing this task.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack sx={{ gap: 2 }}>
      {localError && <Alert severity="warning">{localError}</Alert>}

      {updateError && (
        <Alert severity="error">
          Something went wrong while updating the comment. {updateError.message}
        </Alert>
      )}

      {deleteError && (
        <Alert severity="error">
          Something went wrong while deleting the comment. {deleteError.message}
        </Alert>
      )}

      {comments.map((comment) => (
        <Paper
          key={comment.id}
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.default",
          }}
        >
          <Stack sx={{ gap: 2 }}>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.main",
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>

                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {shortId(comment.author_id)}
                  </Typography>

                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <AccessTimeIcon
                      sx={{
                        fontSize: 15,
                        color: "text.secondary",
                      }}
                    />

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.85rem",
                      }}
                    >
                      {formatDate(comment.created_at)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Box>
                <IconButton
                  size="small"
                  onClick={() => startEditing(comment)}
                  disabled={updating || deleting}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(comment.id)}
                  disabled={updating || deleting}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>

            <Divider />

            {editingId === comment.id ? (
              <Stack sx={{ gap: 1.5 }}>
                <TextField
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  multiline
                  minRows={2}
                  fullWidth
                  disabled={updating}
                />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  sx={{
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={
                      updating ? <CircularProgress size={16} /> : <SaveIcon />
                    }
                    onClick={() => handleUpdate(comment.id)}
                    disabled={updating || !editedBody.trim()}
                  >
                    {updating ? "Saving..." : "Save"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CloseIcon />}
                    onClick={cancelEditing}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                }}
              >
                {comment.body}
              </Typography>
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export default CommentList;