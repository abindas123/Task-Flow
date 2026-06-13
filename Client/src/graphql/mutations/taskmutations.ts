import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation Createtask(
    $title: String!
    $description: String
    $status: String!
    $priority: String!
    $project_id: ID!
    $assignee_id: ID
    $due_date: String
  ) {
    Createtask(
      title: $title
      description: $description
      status: $status
      priority: $priority
      project_id: $project_id
      assignee_id: $assignee_id
      due_date: $due_date
    ) {
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

export const UPDATE_TASK = gql`
  mutation Updatetask(
    $id: ID!
    $title: String!
    $description: String
    $priority: String!
    $assignee_id: ID
    $due_date: String
  ) {
    Updatetask(
      id: $id
      title: $title
      description: $description
      priority: $priority
      assignee_id: $assignee_id
      due_date: $due_date
    ) {
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

export const UPDATE_TASK_STATUS = gql`
  mutation Updatetaskstatus($id: ID!, $status: String!) {
    Updatetaskstatus(id: $id, status: $status) {
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