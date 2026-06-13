import { gql } from "@apollo/client";
export const GET_COMMENTS_BY_TASK = gql`
  query GetCommentsByTask($task_id: ID!) {
    Getcommentsbytask(task_id: $task_id) {
      id
      task_id
      author_id
      body
      created_at
      Updated_at
    }
  }
`;