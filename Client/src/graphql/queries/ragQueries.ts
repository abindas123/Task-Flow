import { gql } from "@apollo/client";

export const ASK_PROJECT_AI = gql`
  query AskProjectAI($project_id: ID!, $question: String!) {
    askProjectAI(project_id: $project_id, question: $question) {
      answer
      sources {
        source_type
        source_id
        content
        metadata_json
        distance
      }
    }
  }
`;

export const ASK_TASK_AI = gql`
  query AskTaskAI($task_id: ID!, $question: String!) {
    askTaskAI(task_id: $task_id, question: $question) {
      answer
      sources {
        source_type
        source_id
        content
        metadata_json
        distance
      }
    }
  }
`;