import { gql } from "@apollo/client";

export const GET_TASK_BY_ID = gql`
  query Gettaskbyid($id: ID!) {
    Gettaskbyid(id: $id) {
      id
      title
      description
      status
      priority
      project_id
      assignee_id
      due_date
      created_by
      created_at
      updated_at
    }
  }
`;

export const GET_TASKS_BY_PROJECT = gql`
  query Gettasksbyproject($project_id: ID!) {
    Gettasksbyproject(project_id: $project_id) {
      id
      title
      description
      status
      priority
      project_id
      assignee_id
      due_date
      created_by
      created_at
      updated_at
    }
  }
`;
export const GET_TASK_OPTIONS_BY_PROJECT = gql`
  query GetTaskOptionsByProject($project_id: ID!) {
    Gettasksbyproject(project_id: $project_id) {
      id
      title
    }
  }
`;