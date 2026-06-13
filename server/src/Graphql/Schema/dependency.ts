export const dependencyTypedefs = `#graphql
type Dependency {
  id: ID!
  task_id: ID!
  depends_on_task_id: ID!
  dependency_type: String!
  created_at: String

  task_title: String
  depends_on_task_title: String
}

extend type Mutation {
  CreateDependency(
    task_id: ID!
    depends_on_task_id: ID!
  ): Dependency!

  DeleteDependency(
    id: ID!
  ): Dependency!
}

extend type Query {
  GetDependenciesByTask(
    task_id: ID!
  ): [Dependency!]!
}
`;