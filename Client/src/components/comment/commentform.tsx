import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
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

function CommentForm({ taskId,authorId, onCreated }: CommentFormProps) {
  const [body, setBody] = useState("");

  const [createCommentMutation, { loading, error }] = useMutation<
    CreateCommentResponse,
    CreateCommentVariables
  >(CREATE_COMMENT);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!body.trim()) return;

    await createCommentMutation({
      variables: {
        task_id: taskId,
          author_id: authorId,
        body,
      },
    });

    setBody("");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Write a comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        {error && <Alert severity="error">{error.message}</Alert>}

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !body.trim()}
        >
          {loading ? <CircularProgress size={24} /> : "Add Comment"}
        </Button>
      </Stack>
    </form>
  );
}

export default CommentForm;