import { useState } from "react";
import {
  Alert,
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  Updated_at: string;
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

function CommentList({ comments, onChanged }: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedBody, setEditedBody] = useState("");

  const [updateCommentMutation, { loading: updating, error: updateError }] =
    useMutation<UpdateCommentResponse, UpdateCommentVariables>(UPDATE_COMMENT);

  const [deleteCommentMutation, { loading: deleting, error: deleteError }] =
    useMutation<DeleteCommentResponse, DeleteCommentVariables>(DELETE_COMMENT);
    function formatDate(value: string | number | null) {
      if (!value) return "No date";
    
      const dateValue = Number(value);
    
      const date = Number.isNaN(dateValue)
        ? new Date(value)
        : new Date(dateValue);
    
      if (Number.isNaN(date.getTime())) {
        return "Invalid date";
      }
    
      return date.toLocaleString();
    }

  function startEditing(comment: Comment) {
    setEditingId(comment.id);
    setEditedBody(comment.body);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditedBody("");
  }

  async function handleUpdate(commentId: string) {
    if (!editedBody.trim()) return;

    await updateCommentMutation({
      variables: {
        id: commentId,
        body: editedBody,
      },
    });

    setEditingId(null);
    setEditedBody("");
    onChanged();
  }

  async function handleDelete(commentId: string) {
    await deleteCommentMutation({
      variables: {
        id: commentId,
      },
    });

    onChanged();
  }

  if (comments.length === 0) {
    return (
      <Typography color="text.secondary">
        No comments yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {updateError && <Alert severity="error">{updateError.message}</Alert>}
      {deleteError && <Alert severity="error">{deleteError.message}</Alert>}

      {comments.map((comment) => (
        <Paper key={comment.id} sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
              <Typography variant="body2" color="text.secondary">
                Author: {comment.author_id}
              </Typography>

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
            </Box>

            <Divider />

            {editingId === comment.id ? (
              <Stack spacing={1}>
                <TextField
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  multiline
                  minRows={2}
                  fullWidth
                />

               <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleUpdate(comment.id)}
                    disabled={updating || !editedBody.trim()}
                  >
                    {updating ? <CircularProgress size={20} /> : "Save"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={cancelEditing}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Typography>{comment.body}</Typography>
            )}

            <Typography variant="caption" color="text.secondary">
           Created: {formatDate(comment.created_at)}
            </Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export default CommentList;