export const workspacetypeDefs=`#graphql
type Workspace{
id:ID!
name:String!
description:String!
owner_id: ID!
created_at: String
updated_at: String
}
type WorkspaceMember{
id: ID!
workspace_id: ID!
user_id: ID!
role: String!
joined_at: String
name: String!
email: String!

}
extend type Mutation{
createWorkspace(
name:String!,description:String!,owner_id:ID!
):Workspace!
 
addMember(
 workspace_id: ID!
 user_id: ID!
role: String!
): WorkspaceMember!
}

extend type Query{
    getWorkspaceById(id: ID!): Workspace
    getWorkspaceMembers(workspace_id: ID!): [WorkspaceMember!]!
    getallworkspaces:[Workspace!]!
}



`