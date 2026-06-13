export const activityLogTypeDefs = `#graphql
scalar JSON

enum ActivityType {
  WORKSPACE_CREATED
  PROJECT_CREATED
  TASK_CREATED
  TASK_ASSIGNED
  TASK_STATUS_CHANGED
  COMMENT_ADDED
  DEPENDENCY_ADDED
}

type ActivityLog {
  id: ID!
  workspace_id: ID!
  project_id: ID
  task_id: ID
  actor_id: ID!
  actor_name: String
  activity_type: ActivityType!
  payload_json: JSON
  created_at: String
}

extend type Query {
  GetActivityLogsByProject(project_id: ID!): [ActivityLog!]!
}
`;