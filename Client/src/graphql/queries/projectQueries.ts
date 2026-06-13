import { gql } from "@apollo/client";

export const getProjectById=gql`
query getprojectbyid($id:ID!){
getProjectById(id:$id){
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
export const getProjectbyworkspace=gql`
query getProjectsbyworkspace($workspace_id:ID!){
 getProjectsByWorkspace(workspace_id:$workspace_id){
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