import { gql } from "@apollo/client";

export const GET_WORKSPACE_BY_ID = gql`
  query GetWorkspaceById($id: ID!) {
    getWorkspaceById(id: $id) {
      id
      name
      description
      owner_id
      created_at
      updated_at
    }
  }
`
export const GET_WORKSPACE_MEMBERS = gql`
  query GetWorkspaceMembers($workspace_id: ID!) {
    getWorkspaceMembers(workspace_id: $workspace_id) {
      id
      workspace_id
      user_id
      role
      joined_at
    }
  }
`;
export const GET_ALL_WORKSPCAES=gql`
query Getallworkspcaes{
getallworkspaces{
id
name
 description
owner_id
created_at
updated_at

}
}
`