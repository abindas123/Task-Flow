export const ProjectsTypeDefs = `#graphql
  type Project {
    id: ID!
    name: String!
    description: String
    workspace_id: ID!
    status: String!
    created_by: String!
    created_at: String!
    updated_at: String!
  }

  extend type Mutation {
    createProject(
      name: String!
      description: String
      workspace_id: ID!
      status: String!
    ): Project!

    updateProject(
      id: ID!
      name: String!
      description: String
      status: String!
    ): Project!
  }

  extend type Query {
    getProjectById(id: ID!): Project
    getProjectsByWorkspace(workspace_id: ID!): [Project!]!
  }
`;