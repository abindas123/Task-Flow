import { gql } from "@apollo/client";

export const GET_ACTIVITY_LOGS_BY_PROJECT = gql`
  query GetActivityLogsByProject($project_id: ID!) {
  GetActivityLogsByProject(project_id: $project_id) {
      id
      workspace_id
      project_id
      task_id
      actor_id
      actor_name
      activity_type
      payload_json
      created_at
    }
  }
`;