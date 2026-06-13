import { gql } from "@apollo/client";

export const GET_DEPENDENCIES_BY_TASK = gql`
  query GetDependenciesByTask($task_id: ID!) {
    GetDependenciesByTask(task_id: $task_id) {
      id
      task_id
      depends_on_task_id
      dependency_type
      created_at
      task_title
      depends_on_task_title
    }
  }
`;