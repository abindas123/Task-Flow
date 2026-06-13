import { gql } from "@apollo/client";

export const CREATE_DEPENDENCY = gql`
  mutation CreateDependency($task_id: ID!, $depends_on_task_id: ID!) {
    CreateDependency(
      task_id: $task_id
      depends_on_task_id: $depends_on_task_id
    ) {
      id
      task_id
      depends_on_task_id
      dependency_type
      created_at
    }
  }
`;

export const DELETE_DEPENDENCY = gql`
  mutation DeleteDependency($id: ID!) {
    DeleteDependency(id: $id) {
      id
      task_id
      depends_on_task_id
      dependency_type
      created_at
    }
  }
`;