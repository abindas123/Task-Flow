import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation CreateComment($task_id: ID!, $author_id: ID!, $body: String!) {
    Createcomment(task_id: $task_id, author_id: $author_id, body: $body) {
      id
      task_id
      author_id
      body
      created_at
      Updated_at
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $body: String!) {
    Updatecomment(id: $id, body: $body) {
      id
      task_id
      author_id
      body
      created_at
      Updated_at
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    Deletecomment(id: $id) {
      id
      task_id
      author_id
      body
      created_at
      Updated_at
    }
  }
`;