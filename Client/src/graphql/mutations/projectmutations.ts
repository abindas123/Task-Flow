import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!
    $description: String!
    $workspace_id: ID!
    $status: String!
  ) {
    createProject(
      name: $name
      description: $description
      workspace_id: $workspace_id
      status: $status
    ) {
      id
      name
      description
      workspace_id
      status
      created_by
      created_at
      updated_at
    }
  }
`


export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String!
    $description: String
    $status: String!
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
    ) {
      id
      name
      description
      workspace_id
      status
      created_by
      created_at
      updated_at
    }
  }
`;