import { useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { ASK_PROJECT_AI } from "../../graphql/queries/ragQueries";

type RagSource = {
  source_type: string;
  source_id: string;
  content: string;
  metadata_json: string;
  distance: number;
};

type AskProjectAIResponse = {
  askProjectAI: {
    answer: string;
    sources: RagSource[];
  };
};

type AskProjectAIVariables = {
  project_id: string;
  question: string;
};

type ProjectAIAssistantProps = {
  projectId: string;
};

function ProjectAIAssistant({ projectId }: ProjectAIAssistantProps) {
  const [question, setQuestion] = useState("");

  const [askProjectAI, { data, loading, error }] = useLazyQuery<
    AskProjectAIResponse,
    AskProjectAIVariables
  >(ASK_PROJECT_AI);

  function handleAsk() {
    const cleanedQuestion = question.trim();

    if (!cleanedQuestion) {
      return;
    }

    askProjectAI({
      variables: {
        project_id: projectId,
        question: cleanedQuestion,
      },
    });
  }

  function handleQuickQuestion(text: string) {
    setQuestion(text);

    askProjectAI({
      variables: {
        project_id: projectId,
        question: text,
      },
    });
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack sx={{direction:"row", spacing:1 ,alignItems:"center"}}>
            <AutoAwesomeIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{fontWeight:700}}>
                AI Project Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ask questions about tasks, blockers, comments, dependencies, and activity logs.
              </Typography>
            </Box>
          </Stack>

          <Stack sx={{direction:"row", spacing:1 ,flexWrap:"wrap"}}>
            <Chip
              label="What is blocking this project?"
              onClick={() => handleQuickQuestion("What is blocking this project?")}
              clickable
            />
            <Chip
              label="What should I work on next?"
              onClick={() => handleQuickQuestion("What should I work on next?")}
              clickable
            />
            <Chip
              label="Summarize recent changes"
              onClick={() => handleQuickQuestion("Summarize recent changes")}
              clickable
            />
          </Stack>

          <TextField
            label="Ask AI about this project"
            placeholder="Example: Which task is most urgent?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <Button
            variant="contained"
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />
            }
          >
            {loading ? "Thinking..." : "Ask AI"}
          </Button>

          {error && (
            <Alert severity="error">
              {error.message}
            </Alert>
          )}

          {data?.askProjectAI && (
            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 3,
                bgcolor: "background.default",
              }}
            >
              <Typography sx={{variant:"subtitle1", fontWeight:700}} gutterBottom>
                Answer
              </Typography>

              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {data.askProjectAI.answer}
              </Typography>

              <Divider sx={{ my: 2 }} />

               <Typography sx={{variant:"subtitle2", fontWeight:700}} gutterBottom>
                Sources used
              </Typography>

              <Stack spacing={1}>
                {data.askProjectAI.sources.map((source, index) => (
                  <Box
                    key={`${source.source_type}-${source.source_id}-${index}`}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                      <Chip size="small" label={source.source_type} />
                      <Typography variant="caption" color="text.secondary">
                        similarity distance: {source.distance.toFixed(3)}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {source.content}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProjectAIAssistant;