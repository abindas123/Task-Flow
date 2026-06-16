export const ragTypeDefs = `#graphql
  type RagSource {
    source_type: String!
    source_id: ID!
    content: String!
    metadata_json: String!
    distance: Float!
  }

  type RagAnswer {
    answer: String!
    sources: [RagSource!]!
  }

  extend type Query {
    askProjectAI(project_id: ID!, question: String!): RagAnswer!
    askTaskAI(task_id: ID!, question: String!): RagAnswer!
  }
`;