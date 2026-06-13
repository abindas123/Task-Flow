import { gql } from "@apollo/client";

export const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!, $description: String!,$owner_id:ID!) {
    createWorkspace(name: $name, description: $description,owner_id:$owner_id) {
      id
      name
      description
      owner_id
      created_at
      updated_at
    }
  }
`;